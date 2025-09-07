'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { UploadPanel } from '@/components/upload-panel';
import { useToast } from "@/hooks/use-toast"
import { DisplayPanel } from '@/components/display-panel';
import { Workbench, WorkbenchProps } from '@/components/workbench';
import { Filmstrip } from '@/components/filmstrip';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarMain } from '@/components/sidebar';


import { restoreUploadedPhoto } from '@/ai/flows/restore-uploaded-photo';
import { reimagineAnotherMoment } from '@/ai/flows/reimagine-another-moment';
import { generateSubtleSmile } from '@/ai/flows/generate-subtle-smile';
import { createDifferentPose } from '@/ai/flows/create-different-pose';
import { widenTheScene } from '@/ai/flows/widen-the-scene';
import { outpaintImage } from '@/ai/flows/outpaint-image';

export type FlowType = 'moment' | 'smile' | 'pose' | 'widen' | 'outpaint' | 'scenery' | 'animate';

export interface Echo {
  id: string;
  src: string;
  type: 'original' | 'restored' | FlowType;
}

const createImageOnCanvas = (imageSrc: string, aspectRatio: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let originalWidth = img.width;
      let originalHeight = img.height;

      // Limit original image size for performance before placing on canvas
      const MAX_ORIGINAL_DIMENSION = 800;
      if (originalWidth > MAX_ORIGINAL_DIMENSION || originalHeight > MAX_ORIGINAL_DIMENSION) {
        if (originalWidth > originalHeight) {
          originalHeight = (MAX_ORIGINAL_DIMENSION / originalWidth) * originalHeight;
          originalWidth = MAX_ORIGINAL_DIMENSION;
        } else {
          originalWidth = (MAX_ORIGINAL_DIMENSION / originalHeight) * originalWidth;
          originalHeight = MAX_ORIGINAL_DIMENSION;
        }
      }

      const [arWidth, arHeight] = aspectRatio.split(':').map(Number);
      const targetAspectRatio = arWidth / arHeight;
      const originalAspectRatio = originalWidth / originalHeight;

      let canvasWidth: number, canvasHeight: number;

      // Determine canvas dimensions to fully contain the original image
      if (originalAspectRatio > targetAspectRatio) {
        // Original is wider than target, so width determines size
        canvasWidth = originalWidth;
        canvasHeight = originalWidth / targetAspectRatio;
      } else {
        // Original is taller or same as target, so height determines size
        canvasHeight = originalHeight;
        canvasWidth = originalHeight * targetAspectRatio;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      // Fill background with transparency
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Calculate position to center the image
      const x = (canvasWidth - originalWidth) / 2;
      const y = (canvasHeight - originalHeight) / 2;

      ctx.drawImage(img, x, y, originalWidth, originalHeight);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => {
      console.error("Failed to load image for canvas creation", err);
      reject(new Error('Failed to load image for canvas creation.'));
    };
    img.src = imageSrc;
  });
};


function Header({ onImageUpload, hasEchoes }: { onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void, hasEchoes: boolean}) {
    return (
        <header className="py-4 px-6 flex items-center justify-between border-b shrink-0 gap-4">
            <div className="flex items-center gap-4">
                {hasEchoes && <SidebarTrigger className="lg:hidden" />}
                <div className="flex-grow">
                    <h1 className="text-xl font-bold font-headline tracking-wide">
                    Echoes of Time
                    </h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                        Breathe new life into your cherished memories.
                    </p>
                </div>
            </div>
             {hasEchoes && (
                <Button asChild variant="outline" size="sm">
                    <label htmlFor="photo-upload-secondary" className="cursor-pointer">
                        Upload Another
                        <input id="photo-upload-secondary" type="file" className="hidden" onChange={onImageUpload} accept="image/png, image/jpeg" />
                    </label>
                </Button>
             )}
        </header>
    );
}


export default function Home() {
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [activeEchoId, setActiveEchoId] = useState<string | null>(null);
  const [loadingFlow, setLoadingFlow] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    setEchoes([]);
    setActiveEchoId(null);
    setLoadingFlow('restoring');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const dataUri = reader.result as string;
        
        const originalEcho = { id: `echo-${Date.now()}-original`, src: dataUri, type: 'original' as const };
        
        setEchoes([originalEcho]);
        setActiveEchoId(originalEcho.id);
        setLoadingFlow('restoring');
        
        const result = await restoreUploadedPhoto({ photoDataUri: dataUri });
        
        if (result.restoredPhotoDataUri) {
            const restoredEcho = { id: `echo-${Date.now()}-restored`, src: result.restoredPhotoDataUri, type: 'restored' as const };
            setEchoes(prev => [...prev, restoredEcho]);
            setActiveEchoId(restoredEcho.id);
        } else {
          throw new Error("Restoration failed to produce an image.");
        }
        
      } catch (error) {
        console.error("Restoration failed:", error);
        toast({
          title: "Restoration Failed",
          description: "Something went wrong while restoring your photo. Please try again.",
          variant: "destructive",
        });
        setEchoes([]);
      } finally {
        setLoadingFlow(null);
      }
    };
    reader.onerror = () => {
        console.error("Failed to read file");
        toast({
          title: "File Read Error",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
        setLoadingFlow(null);
    };
    reader.readAsDataURL(file);
  };

  const runFlow = async (type: FlowType, referenceImage: string, options?: { aspectRatio?: string }) => {
    switch (type) {
        case 'moment': {
            const result = await reimagineAnotherMoment({ restoredMasterImage: referenceImage });
            return result.reimaginedImage;
        }
        case 'smile': {
            const result = await generateSubtleSmile({ referenceImage });
            return result.newImage;
        }
        case 'pose': {
            const result = await createDifferentPose({ restoredMasterImage: referenceImage });
            return result.generatedImage;
        }
        case 'widen': {
            const result = await widenTheScene({ restoredImage: referenceImage });
            return result.widenedSceneImage;
        }
        case 'outpaint': {
            if (!options?.aspectRatio) throw new Error("Aspect ratio not provided for outpainting.");
            const imageOnCanvas = await createImageOnCanvas(referenceImage, options.aspectRatio);
            const result = await outpaintImage({ referenceImage: imageOnCanvas });
            return result.outpaintedImage;
        }
        case 'scenery':
        case 'animate':
            toast({
                title: "Coming Soon!",
                description: "This feature is under development and will be available shortly.",
            });
            return null;
        default:
            throw new Error(`Unknown flow type: ${type}`);
    }
  }

  const handleReimagine: WorkbenchProps['onReimagine'] = async (type, options) => {
    const activeEcho = echoes.find(e => e.id === activeEchoId);
    if (!activeEcho || loadingFlow) return;

    setLoadingFlow(type);
    const originalActiveId = activeEchoId;
    setActiveEchoId(null);

    try {
        const referenceImage = echoes.find(e => e.type === 'restored')?.src ?? activeEcho.src;
        const newImage = await runFlow(type, referenceImage, options);

        if (newImage) {
            const newEcho = { id: `echo-${Date.now()}-${type}`, src: newImage, type };
            setEchoes(prev => [...prev, newEcho]);
            setActiveEchoId(newEcho.id);
        } else {
            if (type !== 'scenery' && type !== 'animate') {
              throw new Error(`Re-imagination of type '${type}' failed to produce an image.`);
            }
        }
    } catch (error) {
        console.error(`Re-imagination failed for ${type}:`, error);
        toast({
            title: "Re-imagination Failed",
            description: "Something went wrong while creating a new echo. Please try again.",
            variant: "destructive",
        });
    } finally {
        setLoadingFlow(null);
        if (activeEchoId === null) {
          setActiveEchoId(originalActiveId); // Restore active echo if new one wasn't set
        }
    }
  };

  const handleDownload = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    const fileType = imageSrc.startsWith('data:image/png') ? 'png' : 'jpg';
    const echo = echoes.find(e => e.src === imageSrc);
    const fileName = echo ? `echo_${echo.type}_${echo.id.substring(5,10)}` : 'download';
    link.download = `${fileName}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const activeEcho = echoes.find(e => e.id === activeEchoId);

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-transparent text-foreground font-body">
        <Header onImageUpload={handleImageUpload} hasEchoes={echoes.length > 0} />
        
        {echoes.length === 0 ? (
          <main className="flex-grow flex items-center justify-center p-4">
            <UploadPanel
              onImageUpload={handleImageUpload}
              isLoading={loadingFlow === 'restoring'}
            />
          </main>
        ) : (
          <div className="flex-grow flex min-h-0 overflow-hidden">
            <SidebarMain className="flex flex-col flex-grow min-h-0">
                <div className="flex-grow min-h-0">
                    <DisplayPanel
                        activeEcho={activeEcho}
                        isLoading={!!loadingFlow}
                        loadingFlow={loadingFlow}
                        onDownload={handleDownload}
                        echoesCount={echoes.length}
                    />
                </div>
                <Filmstrip
                    echoes={echoes}
                    activeEchoId={activeEchoId}
                    onSelectEcho={setActiveEchoId}
                />
            </SidebarMain>
            <Sidebar>
              <Workbench
                onReimagine={handleReimagine}
                loadingFlow={loadingFlow}
              />
            </Sidebar>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
