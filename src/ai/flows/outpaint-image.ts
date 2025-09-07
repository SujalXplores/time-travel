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
      "A reference image on a canvas as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
          text: `You are a master of photographic restoration and digital inpainting. The user has provided an image that is centered on a transparent canvas. Your task is to intelligently fill in the transparent areas to complete the scene. The generated content must perfectly and photorealistically match the style, lighting, shadows, textures, grain, and historical era of the reference photo. The transition between the original image and the generated content must be absolutely undetectable. The final image should feel like it was originally captured with this wider or taller camera frame, not like an edited photo. Do not change the original photo content at all.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return { outpaintedImage: media!.url! };
  }
);
