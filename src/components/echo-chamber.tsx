'use client';

import Image from 'next/image';
import type { FlowType } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LoaderCircle, Sparkles, SmilePlus, PersonStanding, Expand } from 'lucide-react';

interface EchoChamberProps {
  generatedImages: string[];
  restoredMasterImage: string | null;
  onReimagine: (type: FlowType) => void;
  loadingFlow: string | null;
  isLoading: boolean;
}

const actionButtons = [
  { type: 'moment' as FlowType, label: 'Show Another Moment', icon: Sparkles },
  { type: 'smile' as FlowType, label: 'Generate a Subtle Smile', icon: SmilePlus },
  { type: 'pose' as FlowType, label: 'Create a Different Pose', icon: PersonStanding },
  { type: 'widen' as FlowType, label: 'Widen the Scene', icon: Expand },
];

export function EchoChamber({ generatedImages, restoredMasterImage, onReimagine, loadingFlow, isLoading }: EchoChamberProps) {
  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-dashed">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">The Echo Chamber</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[300px] md:min-h-[500px] flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="font-headline">Restoring your memory...</p>
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="w-full space-y-6">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {generatedImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card className="overflow-hidden shadow-lg">
                          <CardContent className="p-0 aspect-[4/5] relative">
                            <Image
                              src={image}
                              alt={`Generated image ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              data-ai-hint="photo memory"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
              </Carousel>
              {restoredMasterImage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {actionButtons.map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      onClick={() => onReimagine(type)}
                      disabled={loadingFlow !== null}
                      variant="outline"
                      className="bg-background/50"
                    >
                      {loadingFlow === type ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Icon className="mr-2 h-4 w-4" />
                      )}
                      {label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <CardDescription className="font-headline text-lg">Your restored and re-imagined photos will appear here.</CardDescription>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
