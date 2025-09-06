'use server';

/**
 * @fileOverview Restores an uploaded photo using the Gemini 2.5 Flash Image API.
 *
 * - restoreUploadedPhoto - A function that accepts an image data URI and returns a restored image data URI.
 * - RestoreUploadedPhotoInput - The input type for the restoreUploadedPhoto function.
 * - RestoreUploadedPhotoOutput - The return type for the restoreUploadedPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RestoreUploadedPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RestoreUploadedPhotoInput = z.infer<typeof RestoreUploadedPhotoInputSchema>;

const RestoreUploadedPhotoOutputSchema = z.object({
  restoredPhotoDataUri: z.string().describe('The restored photo as a data URI.'),
});
export type RestoreUploadedPhotoOutput = z.infer<typeof RestoreUploadedPhotoOutputSchema>;

export async function restoreUploadedPhoto(input: RestoreUploadedPhotoInput): Promise<RestoreUploadedPhotoOutput> {
  return restoreUploadedPhotoFlow(input);
}

const restoreUploadedPhotoFlow = ai.defineFlow(
  {
    name: 'restoreUploadedPhotoFlow',
    inputSchema: RestoreUploadedPhotoInputSchema,
    outputSchema: RestoreUploadedPhotoOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: [
        {media: {url: input.photoDataUri}},
        {
          text: 'You are a world-class digital restoration artist. Take this user-uploaded photograph, which may be old, damaged, or in black and white. Your task is to perform a masterful restoration. Fully restore it to a high-resolution, vibrant, and photorealistic color image. Meticulously fix all physical damage including scratches, tears, dust, stains, and fading. If the photo is black and white, intelligently colorize it with historically accurate and natural colors. Correct any color cast and yellowing from age to reveal the original, true-to-life colors. Enhance the clarity and detail without making it look artificial. The final result should be a pristine, timeless version of the original memory.',
        },
      ],
      model: 'googleai/gemini-2.5-flash-image-preview',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {restoredPhotoDataUri: media!.url!};
  }
);
