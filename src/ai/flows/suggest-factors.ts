'use server';

/**
 * @fileOverview Suggests relevant competing factors for a given industry.
 *
 * - suggestCompetingFactors - A function that suggests competing factors for an industry.
 * - SuggestCompetingFactorsInput - The input type for the suggestCompetingFactors function.
 * - SuggestCompetingFactorsOutput - The return type for the suggestCompetingFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCompetingFactorsInputSchema = z.object({
  industry: z.string().describe('The industry to suggest competing factors for.'),
});
export type SuggestCompetingFactorsInput = z.infer<typeof SuggestCompetingFactorsInputSchema>;

const SuggestCompetingFactorsOutputSchema = z.object({
  competingFactors: z
    .array(z.string())
    .describe('An array of relevant competing factors for the given industry.'),
});
export type SuggestCompetingFactorsOutput = z.infer<typeof SuggestCompetingFactorsOutputSchema>;

export async function suggestCompetingFactors(
  input: SuggestCompetingFactorsInput
): Promise<SuggestCompetingFactorsOutput> {
  return suggestCompetingFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCompetingFactorsPrompt',
  input: {schema: SuggestCompetingFactorsInputSchema},
  output: {schema: SuggestCompetingFactorsOutputSchema},
  prompt: `You are an expert business strategy consultant.

  Your task is to suggest a list of competing factors for the given industry.
  The competing factors should be relevant and specific to the industry.
  Return the competing factors as a JSON array of strings.

  Industry: {{{industry}}}`,
});

const suggestCompetingFactorsFlow = ai.defineFlow(
  {
    name: 'suggestCompetingFactorsFlow',
    inputSchema: SuggestCompetingFactorsInputSchema,
    outputSchema: SuggestCompetingFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
