'use client';

import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadCloud, LoaderCircle, Camera } from "lucide-react";

interface UploadPanelProps {
  originalImage: string | null;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function UploadPanel({ originalImage, onImageUpload, isLoading }: UploadPanelProps) {
  return (
    <Card className="w-full bg-card/50 backdrop-blur-lg border-dashed shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">The Original Memory</CardTitle>
        <CardDescription>Start by uploading a photo to restore.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[300px] md:min-h-[500px] flex justify-center items-center">
          {isLoading ? (
             <div className="flex flex-col items-center gap-4 text-muted-foreground animate-fade-in">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="font-headline text-lg">Reading your photo...</p>
            </div>
          ) : originalImage ? (
             <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden shadow-2xl animate-fade-in group">
                <Image
                  src={originalImage}
                  alt="Original uploaded memory"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  data-ai-hint="old photo"
                />
             </div>
          ) : (
            <label htmlFor="photo-upload" className="w-full h-full cursor-pointer group animate-fade-in">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center flex flex-col justify-center items-center h-full transition-all duration-300 group-hover:border-primary group-hover:bg-accent/10 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="p-6 bg-secondary rounded-full mb-6 transition-colors duration-300 group-hover:bg-primary/20">
                    <Camera className="h-12 w-12 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl mb-2">Upload a Photo</CardTitle>
                  <CardDescription className="text-base">Click to select an old, damaged, or black-and-white family photo (JPG, PNG).</CardDescription>
              </div>
              <Input id="photo-upload" type="file" className="hidden" onChange={onImageUpload} accept="image/png, image/jpeg" />
            </label>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
