'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { UploadPanel } from '@/components/upload-panel';
import { useToast } from "@/hooks/use-toast"
import { DisplayPanel } from '@/components/display-panel';
import { Workbench } from '@/components/workbench';
import { Filmstrip } from '@/components/filmstrip';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarMain } from '@/components/sidebar';


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

  const handleReimagine = async (type: FlowType) => {
    const activeEcho = echoes.find(e => e.id === activeEchoId);
    if (!activeEcho || loadingFlow) return;

    setLoadingFlow(type);
    const originalActiveId = activeEchoId;
    setActiveEchoId(null);

    try {
        let newImage: string | undefined;
        const referenceImage = echoes.find(e => e.type === 'restored')?.src ?? activeEcho.src;

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
                setActiveEchoId(originalActiveId);
                setLoadingFlow(null);
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
        setActiveEchoId(originalActiveId);
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
          <div className="flex-grow flex overflow-hidden">
            <SidebarMain>
                <div className="flex-grow flex flex-col min-h-0">
                    <DisplayPanel
                        activeEcho={activeEcho}
                        isLoading={!!loadingFlow}
                        loadingFlow={loadingFlow}
                        onDownload={handleDownload}
                        echoesCount={echoes.length}
                    />
                    <Filmstrip
                        echoes={echoes}
                        activeEchoId={activeEchoId}
                        onSelectEcho={setActiveEchoId}
                    />
                </div>
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
