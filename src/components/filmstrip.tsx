'use client';

import Image from 'next/image';
import { ScrollArea, Scrollbar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import type { Echo } from '@/app/page';

interface FilmstripProps {
    echoes: Echo[];
    activeEchoId: string | null;
    onSelectEcho: (id: string) => void;
}

export function Filmstrip({ echoes, activeEchoId, onSelectEcho }: FilmstripProps) {
    if (echoes.length <= 1) return null;

    return (
        <div className="shrink-0 bg-background/80 backdrop-blur-sm border-t">
             <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4 p-4">
                    {echoes.map((echo) => (
                        <Card 
                            key={echo.id}
                            onClick={() => onSelectEcho(echo.id)}
                            className={cn(
                                "h-24 w-20 shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:border-primary/80 shadow-md",
                                activeEchoId === echo.id ? "border-2 border-primary" : "border"
                            )}
                        >
                            <CardContent className="p-0 relative h-full w-full">
                                <Image
                                    src={echo.src}
                                    alt={`Thumbnail for ${echo.type}`}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                                {echo.type === 'original' && (
                                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <p className="text-white text-xs font-bold">Original</p>
                                     </div>
                                )}
                                 {echo.type === 'restored' && (
                                     <div className="absolute top-0.5 right-0.5 bg-primary/80 text-primary-foreground text-[8px] font-bold px-1 rounded-sm">
                                        R
                                     </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Scrollbar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
