'use client';

import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadCloud, LoaderCircle } from "lucide-react";

interface UploadPanelProps {
  originalImage: string | null;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function UploadPanel({ originalImage, onImageUpload, isLoading }: UploadPanelProps) {
  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-dashed">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">The Original Memory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[300px] md:min-h-[500px] flex justify-center items-center">
          {isLoading ? (
             <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="font-headline">Reading your photo...</p>
            </div>
          ) : originalImage ? (
             <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={originalImage}
                  alt="Original uploaded memory"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  data-ai-hint="old photo"
                />
             </div>
          ) : (
            <label htmlFor="photo-upload" className="w-full h-full cursor-pointer group">
              <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center flex flex-col justify-center items-center h-full group-hover:border-primary transition-colors group-hover:bg-accent/50">
                  <UploadCloud className="h-12 w-12 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <CardTitle className="font-headline text-lg mb-2">Upload a Photo</CardTitle>
                  <CardDescription>Drag & drop or click to upload an old, damaged, or black-and-white family photo (JPG, PNG).</CardDescription>
              </div>
              <Input id="photo-upload" type="file" className="hidden" onChange={onImageUpload} accept="image/png, image/jpeg" />
            </label>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
