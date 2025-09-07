'use server';

/**
 * @fileOverview This file defines the Genkit flow for widening the scene of a restored image.
 *
 * - widenTheScene - An async function that takes a data URI of an image and returns a data URI of a widened scene image.
 * - WidenTheSceneInput - The input type for the widenTheScene function, which is a data URI string.
 * - WidenTheSceneOutput - The output type for the widenTheScene function, which is a data URI string.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WidenTheSceneInputSchema = z.object({
  restoredImage: z
    .string()
    .describe(
      "A restored image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type WidenTheSceneInput = z.infer<typeof WidenTheSceneInputSchema>;

const WidenTheSceneOutputSchema = z.object({
  widenedSceneImage: z
    .string()
    .describe(
      'A widened scene image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type WidenTheSceneOutput = z.infer<typeof WidenTheSceneOutputSchema>;

export async function widenTheScene(input: WidenTheSceneInput): Promise<WidenTheSceneOutput> {
  return widenTheSceneFlow(input);
}

const widenTheSceneFlow = ai.defineFlow(
  {
    name: 'widenTheSceneFlow',
    inputSchema: WidenTheSceneInputSchema,
    outputSchema: WidenTheSceneOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          media: {url: input.restoredImage},
        },
        {
          text: `You are a master of photographic composition and digital expansion. Using the provided reference image as the central focal point, generate a new image that dramatically expands the scene with a wider-angle view. You must intelligently and creatively "outpaint" the original scene, revealing more of the surrounding environment. The new details must seamlessly and photorealistically match the style, lighting, shadows, textures, and historical era of the reference photo. The transition between the original image and the generated content should be undetectable. The final image should feel like the original, but captured with a much wider lens.`,
        },
      ],
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    return {widenedSceneImage: media!.url!};
  }
);
