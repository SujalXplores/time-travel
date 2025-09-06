'use client';

import Image from 'next/image';
import type { FlowType } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LoaderCircle, Sparkles, Smile, Users, Telescope, Download, CameraOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface EchoChamberProps {
  generatedImages: string[];
  restoredMasterImage: string | null;
  onReimagine: (type: FlowType) => void;
  onDownload: (image: string, index: number) => void;
  loadingFlow: string | null;
  isLoading: boolean;
}

const actionButtons = [
  { type: 'moment' as FlowType, label: 'Another Moment', icon: Sparkles, tooltip: 'Generate a candid moment just before or after this shot.' },
  { type: 'smile' as FlowType, label: 'Subtle Smile', icon: Smile, tooltip: 'Add a natural-looking smile to the main subject.' },
  { type: 'pose' as FlowType, label: 'Slight Pose', icon: Users, tooltip: 'Change the subjects\' poses in a subtle, natural way.' },
  { type: 'widen' as FlowType, label: 'Expand Scene', icon: Telescope, tooltip: 'Widen the photo to see more of the surroundings.' },
];

export function EchoChamber({ generatedImages, restoredMasterImage, onReimagine, onDownload, loadingFlow, isLoading }: EchoChamberProps) {
  return (
    <Card className="w-full bg-card/50 backdrop-blur-lg border-dashed shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">The Echo Chamber</CardTitle>
        <CardDescription>Your restored and reimagined photos appear here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[300px] md:min-h-[500px] flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground animate-fade-in">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="font-headline text-lg tracking-wide">Restoring your memory...</p>
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="w-full space-y-6">
              <Carousel className="w-full" opts={{ loop: generatedImages.length > 1 }}>
                <CarouselContent>
                  {generatedImages.map((image, index) => (
                    <CarouselItem key={index} className="animate-fade-in">
                      <div className="p-1">
                        <Card className="overflow-hidden shadow-2xl group border-2 border-transparent hover:border-primary transition-all duration-300 relative">
                           <CardContent className="p-0 aspect-[4/5] relative">
                            <Image
                              src={image}
                              alt={`Generated image ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                              data-ai-hint="photo memory"
                            />
                            {index === generatedImages.length - 1 && restoredMasterImage && image === restoredMasterImage && (
                                <div className="absolute top-2 right-2 bg-secondary/80 text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                    RESTORED
                                </div>
                            )}
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => onDownload(image, index)}
                                className="absolute bottom-2 right-2 h-10 w-10 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/75 hover:scale-110"
                            >
                                <Download className="h-5 w-5" />
                            </Button>
                           </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {generatedImages.length > 1 && (
                    <>
                        <CarouselPrevious className="ml-14" />
                        <CarouselNext className="mr-14" />
                    </>
                )}
              </Carousel>
              {restoredMasterImage && (
                <TooltipProvider>
                    <div className="grid grid-cols-2 gap-4 pt-4 animate-fade-in">
                    {actionButtons.map(({ type, label, icon: Icon, tooltip }) => (
                        <Tooltip key={type}>
                        <TooltipTrigger asChild>
                            <Button
                            onClick={() => onReimagine(type)}
                            disabled={loadingFlow !== null}
                            variant="outline"
                            className="bg-background/70 h-12 text-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 group/button"
                            >
                            {loadingFlow === type ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Icon className="mr-2 h-5 w-5 text-muted-foreground group-hover/button:text-accent-foreground transition-colors" />
                            )}
                            {label}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                        </Tooltip>
                    ))}
                    </div>
                </TooltipProvider>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8 animate-fade-in flex flex-col items-center gap-4">
              <CameraOff className="h-16 w-16 text-muted-foreground/50"/>
              <CardDescription className="font-headline text-xl">The Echo Chamber is quiet...</CardDescription>
              <p className="max-w-xs">Upload a photo, and your restored and reimagined memories will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
