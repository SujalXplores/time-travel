'use server';

/**
 * @fileOverview Generates a new image with a subtle, natural smile on the main subject's face.
 *
 * - generateSubtleSmile - A function that handles the image generation process.
 * - GenerateSubtleSmileInput - The input type for the generateSubtleSmile function.
 * - GenerateSubtleSmileOutput - The return type for the generateSubtleSmile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubtleSmileInputSchema = z.object({
  referenceImage: z
    .string()
    .describe(
      "A reference image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateSubtleSmileInput = z.infer<typeof GenerateSubtleSmileInputSchema>;

const GenerateSubtleSmileOutputSchema = z.object({
  newImage: z
    .string()
    .describe(
      'The new image with a subtle smile, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type GenerateSubtleSmileOutput = z.infer<typeof GenerateSubtleSmileOutputSchema>;

export async function generateSubtleSmile(input: GenerateSubtleSmileInput): Promise<GenerateSubtleSmileOutput> {
  return generateSubtleSmileFlow(input);
}

const generateSubtleSmileFlow = ai.defineFlow(
  {
    name: 'generateSubtleSmileFlow',
    inputSchema: GenerateSubtleSmileInputSchema,
    outputSchema: GenerateSubtleSmileOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            {media: {url: input.referenceImage}},
            {
            text: 'You are an expert digital artist specializing in photorealistic facial expressions. Using the provided reference image, regenerate the image but delicately alter the expression of the main subject to a subtle, natural, and happy smile. The smile should be gentle and authentic, engaging the eyes (a "Duchenne smile"). All other elements of the image, including the subject\'s identity, other people, clothing, and the background, must remain absolutely identical. Preserve the original lighting and photographic style.',
            },
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    return {newImage: media!.url!};
  }
);
