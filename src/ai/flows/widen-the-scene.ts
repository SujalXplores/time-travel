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
      prompt: [
        {
          media: {url: input.restoredImage},
        },
        {
          text: `Using the provided reference image as the focal point, generate a new image that shows a wider-angle view. Expand the original scene to reveal more of the surrounding environment, ensuring the new details seamlessly match the style, lighting, and era of the reference photo.`,
        },
      ],
      model: 'googleai/gemini-2.5-flash-image-preview',
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    return {widenedSceneImage: media!.url!};
  }
);
