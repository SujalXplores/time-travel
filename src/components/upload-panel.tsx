'use client';

import type { ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Camera } from "lucide-react";

interface UploadPanelProps {
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function UploadPanel({ onImageUpload, isLoading }: UploadPanelProps) {
  
  if (isLoading) {
    return (
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-fade-in p-8 text-center">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-lg tracking-wide">Restoring your memory...</p>
            <p className="text-sm max-w-xs">This can take a moment, especially for very old photos. Please wait...</p>
        </div>
    );
  }

  return (
    <Card className="w-full max-w-lg bg-card/50 backdrop-blur-lg border-dashed shadow-xl animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Start a New Echo</CardTitle>
        <CardDescription>Upload an old family photo to begin the restoration process.</CardDescription>
      </CardHeader>
      <CardContent>
        <label htmlFor="photo-upload" className="w-full h-full cursor-pointer group">
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center flex flex-col justify-center items-center h-full transition-all duration-300 group-hover:border-primary group-hover:bg-accent/10 group-hover:scale-105 group-hover:shadow-2xl">
              <div className="p-6 bg-secondary rounded-full mb-6 transition-colors duration-300 group-hover:bg-primary/20">
                <Camera className="h-12 w-12 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl mb-2">Upload a Photo</CardTitle>
              <CardDescription className="text-base">Click or drag a JPG or PNG file here.</CardDescription>
          </div>
          <Input id="photo-upload" type="file" className="hidden" onChange={onImageUpload} accept="image/png, image/jpeg" />
        </label>
      </CardContent>
    </Card>
  );
}
