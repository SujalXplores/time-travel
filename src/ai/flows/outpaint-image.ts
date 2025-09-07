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
          text: `You are a world-class expert in digital image restoration and cinematic outpainting. Your task is to expand the scene of the provided image by filling in *only* the transparent areas of the canvas.

**Primary Objective:** Create a photorealistic and seamless extension of the original photograph. The final image must look like a single, original photograph captured with a wider lens.

**Crucial Constraints:**
*   **DO NOT modify, alter, or change the existing, non-transparent part of the image in any way.** The original photo content is sacred.
*   The transition between the original photo and the newly generated areas must be completely undetectable.

**Matching Requirements:** You must meticulously analyze and replicate every characteristic of the original photo, including:
*   **Lighting and Shadows:** Match the direction, softness, color, and intensity of all light sources.
*   **Color Palette and Tone:** Replicate the exact color grading, saturation, and any color casts (e.g., sepia, faded colors).
*   **Film Grain and Noise:** Match the texture and grain of the original photographic medium.
*   **Focus and Depth of Field:** Continue the existing focal plane and lens blur (bokeh).
*   **Historical Era:** Ensure all generated content (objects, clothing, environment) is historically and contextually appropriate for the era of the photo.
*   **Style:** Perfectly match the photographic style, from composition to lens distortion.

The final output should be a single, cohesive image on the same canvas, where the newly generated content feels like a natural and original part of the scene.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return { outpaintedImage: media!.url! };
  }
);
