'use server';

/**
 * @fileOverview An AI agent that expands an image to a target aspect ratio by outpainting.
 *
 * - outpaintImage - A function that handles the outpainting process.
 * - OutpaintImageInput - The input type for the outpaintImage function.
 * - OutpaintImageOutput - The return type for the outpaintImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OutpaintImageInputSchema = z.object({
  referenceImage: z
    .string()
    .describe(
      "A reference image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  aspectRatio: z
    .string()
    .describe('The target aspect ratio for the new image, e.g., "16:9", "1:1", or "9:16".'),
});
export type OutpaintImageInput = z.infer<typeof OutpaintImageInputSchema>;

const OutpaintImageOutputSchema = z.object({
  outpaintedImage: z
    .string()
    .describe(
      'The new, outpainted image as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type OutpaintImageOutput = z.infer<typeof OutpaintImageOutputSchema>;

export async function outpaintImage(input: OutpaintImageInput): Promise<OutpaintImageOutput> {
  return outpaintImageFlow(input);
}

const outpaintImageFlow = ai.defineFlow(
  {
    name: 'outpaintImageFlow',
    inputSchema: OutpaintImageInputSchema,
    outputSchema: OutpaintImageOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: input.referenceImage } },
        {
          text: `You are a master of photographic composition and digital outpainting. The user has provided an image and a target aspect ratio of {{{aspectRatio}}}. Your task is to expand the canvas of the original image to this new aspect ratio, intelligently filling in the new areas. The generated content must perfectly and photorealistically match the style, lighting, shadows, textures, grain, and historical era of the reference photo. The transition between the original image and the generated content must be absolutely undetectable. The final image should feel like it was originally captured with a wider or taller camera frame, not like an edited photo. Preserve the original image content perfectly at the center of the expanded canvas.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return { outpaintedImage: media!.url! };
  }
);
