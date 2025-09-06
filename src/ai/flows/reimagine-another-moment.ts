'use server';
/**
 * @fileOverview An AI agent that reimagine a moment before or after the original photo was taken.
 *
 * - reimagineAnotherMoment - A function that handles the image re-imagination process.
 * - ReimagineAnotherMomentInput - The input type for the reimagineAnotherMoment function.
 * - ReimagineAnotherMomentOutput - The return type for the reimagineAnotherMoment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReimagineAnotherMomentInputSchema = z.object({
  restoredMasterImage: z
    .string()
    .describe(
      "The restored master image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ReimagineAnotherMomentInput = z.infer<typeof ReimagineAnotherMomentInputSchema>;

const ReimagineAnotherMomentOutputSchema = z.object({
  reimaginedImage: z
    .string()
    .describe("The re-imagined image as a data URI."),
});
export type ReimagineAnotherMomentOutput = z.infer<typeof ReimagineAnotherMomentOutputSchema>;

export async function reimagineAnotherMoment(input: ReimagineAnotherMomentInput): Promise<ReimagineAnotherMomentOutput> {
  return reimagineAnotherMomentFlow(input);
}

const reimagineAnotherMomentFlow = ai.defineFlow(
  {
    name: 'reimagineAnotherMomentFlow',
    inputSchema: ReimagineAnotherMomentInputSchema,
    outputSchema: ReimagineAnotherMomentOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: [
        {media: {url: input.restoredMasterImage}},
        {text: 'You are a visual storyteller with the power to travel through time. Based on the provided reference photo, generate a new, photorealistic image that captures a candid, unseen moment either immediately before or after the original shot was taken. This new image must feel like a genuine continuation of the same story. It is absolutely essential to maintain the exact identities, appearances, features, and clothing of the people, as well as the original background, lighting, and photographic style of the era. The goal is to create a seamless "echo" of the original moment, not a different photo altogether.'},
      ],
      model: 'googleai/gemini-2.5-flash-image-preview',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {reimaginedImage: media!.url!};
  }
);
