'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { UploadPanel } from '@/components/upload-panel';
import { EchoChamber } from '@/components/echo-chamber';
import { useToast } from "@/hooks/use-toast"

import { restoreUploadedPhoto } from '@/ai/flows/restore-uploaded-photo';
import { reimagineAnotherMoment } from '@/ai/flows/reimagine-another-moment';
import { generateSubtleSmile } from '@/ai/flows/generate-subtle-smile';
import { createDifferentPose } from '@/ai/flows/create-different-pose';
import { widenTheScene } from '@/ai/flows/widen-the-scene';

export type FlowType = 'moment' | 'smile' | 'pose' | 'widen';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [restoredMasterImage, setRestoredMasterImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
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

    setOriginalImage(null);
    setRestoredMasterImage(null);
    setGeneratedImages([]);
    setLoadingFlow('restoring');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const dataUri = reader.result as string;
        setOriginalImage(dataUri);
        
        const result = await restoreUploadedPhoto({ photoDataUri: dataUri });
        
        if (result.restoredPhotoDataUri) {
            setRestoredMasterImage(result.restoredPhotoDataUri);
            setGeneratedImages([result.restoredPhotoDataUri]);
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
        setOriginalImage(null);
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
    if (!restoredMasterImage || loadingFlow) return;

    setLoadingFlow(type);

    try {
        let newImage: string | undefined;

        switch (type) {
            case 'moment': {
                const result = await reimagineAnotherMoment({ restoredMasterImage });
                newImage = result.reimaginedImage;
                break;
            }
            case 'smile': {
                const result = await generateSubtleSmile({ referenceImage: restoredMasterImage });
                newImage = result.newImage;
                break;
            }
            case 'pose': {
                const result = await createDifferentPose({ restoredMasterImage });
                newImage = result.generatedImage;
                break;
            }
            case 'widen': {
                const result = await widenTheScene({ restoredImage: restoredMasterImage });
                newImage = result.widenedSceneImage;
                break;
            }
        }

        if (newImage) {
            setGeneratedImages(prev => [...prev, newImage]);
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
    } finally {
        setLoadingFlow(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center font-headline text-primary-foreground opacity-80">
          Echoes of Time
        </h1>
      </header>
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <UploadPanel
            originalImage={originalImage}
            onImageUpload={handleImageUpload}
            isLoading={loadingFlow === 'restoring'}
          />
          <EchoChamber
            generatedImages={generatedImages}
            restoredMasterImage={restoredMasterImage}
            onReimagine={handleReimagine}
            loadingFlow={loadingFlow}
            isLoading={loadingFlow === 'restoring'}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Powered by Firebase and Google AI</p>
      </footer>
    </div>
  );
}
