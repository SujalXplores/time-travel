'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Download, CameraOff } from 'lucide-react';
import type { Echo } from '@/app/page';

interface DisplayPanelProps {
  activeEcho: Echo | undefined;
  isLoading: boolean;
  onDownload: (src: string) => void;
}

export function DisplayPanel({ activeEcho, isLoading, onDownload }: DisplayPanelProps) {

  const getLabelForType = (type: Echo['type']) => {
    switch (type) {
        case 'original': return 'Original';
        case 'restored': return 'Restored Master';
        case 'moment': return 'Echo: Another Moment';
        case 'smile': return 'Echo: Subtle Smile';
        case 'pose': return 'Echo: Different Pose';
        case 'widen': return 'Echo: Expanded Scene';
        default: return 'Echo';
    }
  }

  return (
    <div className="flex-grow p-4 md:p-8 flex items-center justify-center bg-black/10">
      <div className="w-full h-full flex items-center justify-center">
        {isLoading && !activeEcho ? (
          <div className="flex flex-col items-center gap-4 text-muted-foreground animate-fade-in">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-lg tracking-wide">Restoring your memory...</p>
          </div>
        ) : activeEcho ? (
          <Card className="max-w-full max-h-full aspect-[4/5] bg-transparent border-0 shadow-2xl group animate-fade-in relative overflow-hidden">
             <CardContent className="p-0 h-full w-full">
              <Image
                src={activeEcho.src}
                alt={`Echo of type ${activeEcho.type}`}
                fill
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-contain"
                data-ai-hint="photo memory"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  {getLabelForType(activeEcho.type)}
              </div>
              <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => onDownload(activeEcho.src)}
                  className="absolute bottom-2 right-2 h-10 w-10 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/75 hover:scale-110"
              >
                  <Download className="h-5 w-5" />
              </Button>
             </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground p-8 animate-fade-in flex flex-col items-center gap-4">
            <CameraOff className="h-16 w-16 text-muted-foreground/50"/>
            <p className="font-headline text-xl">The Lightbox is Empty</p>
            <p className="max-w-xs text-sm">Upload a photo to begin your journey through time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
