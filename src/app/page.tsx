'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { UploadPanel } from '@/components/upload-panel';
import { useToast } from "@/hooks/use-toast"
import { DisplayPanel } from '@/components/display-panel';
import { Workbench } from '@/components/workbench';
import { Filmstrip } from '@/components/filmstrip';

import { restoreUploadedPhoto } from '@/ai/flows/restore-uploaded-photo';
import { reimagineAnotherMoment } from '@/ai/flows/reimagine-another-moment';
import { generateSubtleSmile } from '@/ai/flows/generate-subtle-smile';
import { createDifferentPose } from '@/ai/flows/create-different-pose';
import { widenTheScene } from '@/ai/flows/widen-the-scene';

export type FlowType = 'moment' | 'smile' | 'pose' | 'widen' | 'scenery' | 'animate';

export interface Echo {
  id: string;
  src: string;
  type: 'original' | 'restored' | FlowType;
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

  const handleReimagine = async (type: FlowType) => {
    const activeEcho = echoes.find(e => e.id === activeEchoId);
    if (!activeEcho || loadingFlow) return;

    setLoadingFlow(type);
    const originalActiveId = activeEchoId;
    setActiveEchoId(null); // Clear active echo to show loader

    try {
        let newImage: string | undefined;
        const referenceImage = activeEcho.src;

        switch (type) {
            case 'moment': {
                const result = await reimagineAnotherMoment({ restoredMasterImage: referenceImage });
                newImage = result.reimaginedImage;
                break;
            }
            case 'smile': {
                const result = await generateSubtleSmile({ referenceImage });
                newImage = result.newImage;
                break;
            }
            case 'pose': {
                const result = await createDifferentPose({ restoredMasterImage: referenceImage });
                newImage = result.generatedImage;
                break;
            }
            case 'widen': {
                const result = await widenTheScene({ restoredImage: referenceImage });
                newImage = result.widenedSceneImage;
                break;
            }
            case 'scenery':
            case 'animate':
                toast({
                    title: "Coming Soon!",
                    description: "This feature is under development and will be available shortly.",
                });
                setActiveEchoId(originalActiveId); // Restore active id if feature is not available
                return;
        }

        if (newImage) {
            const newEcho = { id: `echo-${Date.now()}-${type}`, src: newImage, type };
            setEchoes(prev => [...prev, newEcho]);
            setActiveEchoId(newEcho.id);
        } else {
            throw new Error(`Re-imagination of type '${type}' failed to produce an image.`);
        }

    } catch (error) {
        console.error(`Re-imagination failed for ${type}:`, error);
        toast({
            title: "Re-imagination Failed",
            description: "Something went wrong while creating a new echo. Please try again.",
            variant: "destructive",
        });
        setActiveEchoId(originalActiveId); // Restore active id on failure
    } finally {
        setLoadingFlow(null);
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
    <div className="flex flex-col h-screen bg-transparent text-foreground font-body">
        <header className="py-4 px-6 flex items-center justify-between border-b shrink-0">
            <div className="text-center">
                <h1 className="text-xl font-bold font-headline tracking-wide">
                Echoes of Time
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                    Breathe new life into your cherished memories.
                </p>
            </div>
             {echoes.length > 0 && (
                <label htmlFor="photo-upload-secondary" className="cursor-pointer">
                    <span className="text-sm font-medium hover:text-primary transition-colors">Upload Another</span>
                    <input id="photo-upload-secondary" type="file" className="hidden" onChange={handleImageUpload} accept="image/png, image/jpeg" />
                </label>
             )}
        </header>
        
        {echoes.length === 0 ? (
            <main className="flex-grow flex items-center justify-center p-4">
                 <UploadPanel
                    onImageUpload={handleImageUpload}
                    isLoading={loadingFlow === 'restoring'}
                />
            </main>
        ) : (
            <div className="flex flex-grow overflow-hidden">
                <main className="flex-grow flex flex-col overflow-hidden relative">
                    <DisplayPanel
                        activeEcho={activeEcho}
                        isLoading={!!loadingFlow}
                        loadingFlow={loadingFlow}
                        onDownload={handleDownload}
                    />
                    <Filmstrip
                        echoes={echoes}
                        activeEchoId={activeEchoId}
                        onSelectEcho={setActiveEchoId}
                    />
                </main>
                <Workbench
                    onReimagine={handleReimagine}
                    loadingFlow={loadingFlow}
                />
            </div>
        )}

      <footer className="text-center p-2 text-xs text-muted-foreground border-t shrink-0">
        <p>Powered by Firebase and Google AI</p>
      </footer>
    </div>
  );
}
