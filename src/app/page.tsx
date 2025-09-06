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
        // The most recent image is the best candidate for modification
        const referenceImage = generatedImages[0] || restoredMasterImage;

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
        }

        if (newImage) {
            setGeneratedImages(prev => [newImage, ...prev]);
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

  const handleDownload = (image: string, index: number) => {
    const link = document.createElement('a');
    link.href = image;
    const fileType = image.startsWith('data:image/png') ? 'png' : 'jpg';
    const fileName = index === generatedImages.length - 1 ? 'restored_master' : `echo_${generatedImages.length - index}`;
    link.download = `${fileName}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground font-body">
      <header className="py-12 md:py-16">
        <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-wide">
            Echoes of Time
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
                Breathe new life into your cherished memories. Restore, recolor, and reimagine your old family photos with the power of AI.
            </p>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 pb-12">
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
            onDownload={handleDownload}
            loadingFlow={loadingFlow}
            isLoading={loadingFlow === 'restoring'}
          />
        </div>
      </main>
      <footer className="text-center p-6 text-sm text-muted-foreground">
        <p>Powered by Firebase and Google AI</p>
      </footer>
    </div>
  );
}
