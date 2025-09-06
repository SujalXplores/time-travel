'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle, Download, CameraOff } from 'lucide-react';
import type { Echo, FlowType } from '@/app/page';

interface DisplayPanelProps {
  activeEcho: Echo | undefined;
  isLoading: boolean;
  loadingFlow: string | null;
  onDownload: (src: string) => void;
}

export function DisplayPanel({ activeEcho, isLoading, loadingFlow, onDownload }: DisplayPanelProps) {

  const getLabelForType = (type: Echo['type'] | FlowType) => {
    switch (type) {
        case 'original': return 'Original';
        case 'restored': return 'Restored Master';
        case 'restoring': return 'Restoring your memory...';
        case 'moment': return 'Creating another moment...';
        case 'smile': return 'Adding a subtle smile...';
        case 'pose': return 'Crafting a different pose...';
        case 'widen': return 'Expanding the scene...';
        default: return 'Generating Echo...';
    }
  }

  const renderLoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground animate-fade-in">
        <div className="relative w-full max-w-lg aspect-[4/5]">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                 <p className="font-headline text-lg tracking-wide mt-4 text-white/90">
                    {getLabelForType(loadingFlow as FlowType)}
                </p>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex-grow p-4 md:p-8 flex items-center justify-center bg-black/10">
      <div className="w-full h-full flex items-center justify-center">
        {isLoading ? renderLoadingState() : activeEcho ? (
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
        ) : !echoes.length ? (
          <div className="text-center text-muted-foreground p-8 animate-fade-in flex flex-col items-center gap-4">
            <CameraOff className="h-16 w-16 text-muted-foreground/50"/>
            <p className="font-headline text-xl">The Lightbox is Empty</p>
            <p className="max-w-xs text-sm">Upload a photo to begin your journey through time.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
