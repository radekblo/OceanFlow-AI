'use server';

/**
 * @fileOverview A flow that provides suggestions for value innovation opportunities based on market gaps.
 *
 * - getValueInnovationSuggestions - A function that generates value innovation suggestions.
 * - ValueInnovationSuggestionsInput - The input type for the getValueInnovationSuggestions function.
 * - ValueInnovationSuggestionsOutput - The return type for the getValueInnovationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValueInnovationSuggestionsInputSchema = z.object({
  industry: z.string().describe('The industry to analyze for value innovation opportunities.'),
  competitorValueCurves: z.string().describe('The value curves of key competitors in the industry, described in detail.'),
  customerNeeds: z.string().describe('Description of customer needs and pain points.'),
});

export type ValueInnovationSuggestionsInput = z.infer<typeof ValueInnovationSuggestionsInputSchema>;

const ValueInnovationSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      factor: z.string().describe('The competing factor to innovate on.'),
      opportunity: z.string().describe('A description of the value innovation opportunity.'),
      rationale: z.string().describe('The rationale behind the suggestion, based on market gaps and customer needs.'),
    })
  ).describe('A list of value innovation suggestions.'),
});

export type ValueInnovationSuggestionsOutput = z.infer<typeof ValueInnovationSuggestionsOutputSchema>;

export async function getValueInnovationSuggestions(input: ValueInnovationSuggestionsInput): Promise<ValueInnovationSuggestionsOutput> {
  return valueInnovationSuggestionsFlow(input);
}

const valueInnovationSuggestionsPrompt = ai.definePrompt({
  name: 'valueInnovationSuggestionsPrompt',
  input: {schema: ValueInnovationSuggestionsInputSchema},
  output: {schema: ValueInnovationSuggestionsOutputSchema},
  prompt: `You are a Blue Ocean Strategy expert. Your task is to identify value innovation opportunities for businesses.

  Analyze the provided industry, competitor value curves, and customer needs, and suggest specific areas where the business can differentiate itself and create new value for customers.

  Industry: {{{industry}}}
  Competitor Value Curves: {{{competitorValueCurves}}}
  Customer Needs: {{{customerNeeds}}}

  Based on this information, provide a list of value innovation suggestions, including the factor to innovate on, a description of the opportunity, and the rationale behind the suggestion. Focus on opportunities that address unmet customer needs or exploit weaknesses in competitor value curves.

  Format your response as a JSON object conforming to the following schema:
  ${JSON.stringify(ValueInnovationSuggestionsOutputSchema)}
`,
});

const valueInnovationSuggestionsFlow = ai.defineFlow(
  {
    name: 'valueInnovationSuggestionsFlow',
    inputSchema: ValueInnovationSuggestionsInputSchema,
    outputSchema: ValueInnovationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await valueInnovationSuggestionsPrompt(input);
    return output!;
  }
);
