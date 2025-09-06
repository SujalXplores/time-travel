'use client';

import Image from 'next/image';
import type { FlowType } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LoaderCircle, Sparkles, Smile, Users, Telescope } from 'lucide-react';

interface EchoChamberProps {
  generatedImages: string[];
  restoredMasterImage: string | null;
  onReimagine: (type: FlowType) => void;
  loadingFlow: string | null;
  isLoading: boolean;
}

const actionButtons = [
  { type: 'moment' as FlowType, label: 'Another Moment', icon: Sparkles },
  { type: 'smile' as FlowType, label: 'Add a Smile', icon: Smile },
  { type: 'pose' as FlowType, label: 'Change Pose', icon: Users },
  { type: 'widen' as FlowType, label: 'Expand Scene', icon: Telescope },
];

export function EchoChamber({ generatedImages, restoredMasterImage, onReimagine, loadingFlow, isLoading }: EchoChamberProps) {
  return (
    <Card className="w-full bg-card/50 backdrop-blur-lg border-dashed shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">The Echo Chamber</CardTitle>
        <CardDescription>Generated memories from your original photo.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[300px] md:min-h-[500px] flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground animate-fade-in">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="font-headline text-lg">Restoring your memory...</p>
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="w-full space-y-6">
              <Carousel className="w-full" opts={{ loop: generatedImages.length > 1 }}>
                <CarouselContent>
                  {generatedImages.map((image, index) => (
                    <CarouselItem key={index} className="animate-fade-in">
                      <div className="p-1">
                        <Card className="overflow-hidden shadow-2xl group border-2 border-transparent hover:border-primary transition-all duration-300">
                           <CardContent className="p-0 aspect-[4/5] relative">
                            <Image
                              src={image}
                              alt={`Generated image ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                              data-ai-hint="photo memory"
                            />
                            {index === generatedImages.length - 1 && restoredMasterImage && (
                                <div className="absolute top-2 right-2 bg-secondary/80 text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full">
                                    RESTORED
                                </div>
                            )}
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
                <div className="grid grid-cols-2 gap-3 pt-4 animate-fade-in">
                  {actionButtons.map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      onClick={() => onReimagine(type)}
                      disabled={loadingFlow !== null}
                      variant="outline"
                      className="bg-background/70 h-12 text-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
                    >
                      {loadingFlow === type ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Icon className="mr-2 h-5 w-5" />
                      )}
                      {label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8 animate-fade-in">
              <CardDescription className="font-headline text-xl">Your restored and re-imagined photos will appear here.</CardDescription>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
