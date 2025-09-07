'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle, Download, CameraOff, WandSparkles } from 'lucide-react';
import type { Echo, FlowType } from '@/app/page';
import { cn } from '@/lib/utils';

interface DisplayPanelProps {
  activeEcho: Echo | undefined;
  isLoading: boolean;
  loadingFlow: string | null;
  onDownload: (src: string) => void;
  echoesCount: number;
  className?: string;
}

export function DisplayPanel({ activeEcho, isLoading, loadingFlow, onDownload, echoesCount, className }: DisplayPanelProps) {

  const getLabelForType = (type: Echo['type'] | FlowType | null) => {
    switch (type) {
        case 'original': return 'Original';
        case 'restored': return 'Restored Master';
        case 'restoring': return 'Restoring your memory...';
        case 'moment': return 'Creating another moment...';
        case 'smile': return 'Adding a subtle smile...';
        case 'pose': return 'Crafting a different pose...';
        case 'widen': return 'Zooming out the scene...';
        case 'outpaint': return 'Outpainting the canvas...';
        default: return 'Generating Echo...';
    }
  }

  const renderLoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground animate-fade-in">
        <div className="relative w-full max-w-lg aspect-[4/5] p-2">
            <Skeleton className="w-full h-full rounded-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                 <p className="font-headline text-lg tracking-wide mt-4 text-white/90">
                    {getLabelForType(loadingFlow)}
                </p>
            </div>
        </div>
    </div>
  );

  const renderEmptyState = (title: string, description: string, icon: React.ReactNode) => (
      <div className="text-center text-muted-foreground p-8 animate-fade-in flex flex-col items-center justify-center gap-4 h-full">
        {icon}
        <p className="font-headline text-xl">{title}</p>
        <p className="max-w-xs text-sm">{description}</p>
      </div>
  );

  return (
    <div className={cn("bg-black/10 flex items-center justify-center", className)}>
      <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
        {isLoading ? (
            renderLoadingState()
        ) : activeEcho ? (
          <Card className="w-full h-full bg-transparent border-0 shadow-none group animate-fade-in flex items-center justify-center">
             <CardContent className="p-0 h-full w-full flex items-center justify-center">
                <div className="relative h-full w-full max-h-full max-w-full">
                  <Image
                    src={activeEcho.src}
                    alt={`Echo of type ${activeEcho.type}`}
                    fill
                    sizes="(max-width: 1024px) 90vw, 50vw"
                    className="object-contain rounded-lg shadow-2xl"
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
                      aria-label="Download image"
                  >
                      <Download className="h-5 w-5" />
                  </Button>
                </div>
             </CardContent>
          </Card>
        ) : echoesCount > 0 ? (
            renderEmptyState(
                "Select an Echo",
                "Click a thumbnail in the filmstrip below to view an image.",
                 <WandSparkles className="h-16 w-16 text-muted-foreground/50"/>
            )
        ) : (
          renderEmptyState(
                "The Lightbox is Empty",
                "Upload a photo to begin your journey through time.",
                <CameraOff className="h-16 w-16 text-muted-foreground/50"/>
            )
        )}
      </div>
    </div>
  );
}