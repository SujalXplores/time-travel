'use server';

/**
 * @fileOverview A flow to generate a new image with subjects in a slightly different pose.
 *
 * - createDifferentPose - A function that handles the image generation process.
 * - CreateDifferentPoseInput - The input type for the createDifferentPose function.
 * - CreateDifferentPoseOutput - The return type for the createDifferentPose function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateDifferentPoseInputSchema = z.object({
  restoredMasterImage: z
    .string()
    .describe(
      "The restored master image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CreateDifferentPoseInput = z.infer<typeof CreateDifferentPoseInputSchema>;

const CreateDifferentPoseOutputSchema = z.object({
  generatedImage: z
    .string()
    .describe(
      'The newly generated image with a different pose, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type CreateDifferentPoseOutput = z.infer<typeof CreateDifferentPoseOutputSchema>;

export async function createDifferentPose(
  input: CreateDifferentPoseInput
): Promise<CreateDifferentPoseOutput> {
  return createDifferentPoseFlow(input);
}

const createDifferentPoseFlow = ai.defineFlow(
  {
    name: 'createDifferentPoseFlow',
    inputSchema: CreateDifferentPoseInputSchema,
    outputSchema: CreateDifferentPoseOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
        {
            media: { url: input.restoredMasterImage },
        },
        {
            text: 'Using the provided reference image, generate a new image where the subjects are in a slightly different, relaxed, and natural pose. Their identities, clothing, and the environment must be perfectly consistent with the reference image.',
        },
        ],
        config: {
        responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    return { generatedImage: media!.url! };
  }
);
