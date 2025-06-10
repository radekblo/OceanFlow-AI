'use server';

/**
 * @fileOverview Analyzes a user's emerging strategy and provides feedback on its blue ocean potential.
 *
 * - analyzeBlueOceanPotential - A function that analyzes the strategy and provides feedback.
 * - AnalyzeBlueOceanPotentialInput - The input type for the analyzeBlueOceanPotential function.
 * - AnalyzeBlueOceanPotentialOutput - The return type for the analyzeBlueOceanPotential function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBlueOceanPotentialInputSchema = z.object({
  strategyCanvas: z.string().describe('A description of the strategy canvas, including the competing factors and value levels.'),
  fourActionsGrid: z.string().describe('A description of the ERRC grid, outlining the actions to eliminate, reduce, raise, and create.'),
  targetMarket: z.string().describe('The target market or industry for the strategy.'),
});
export type AnalyzeBlueOceanPotentialInput = z.infer<typeof AnalyzeBlueOceanPotentialInputSchema>;

const AnalyzeBlueOceanPotentialOutputSchema = z.object({
  differentiationFeedback: z.string().describe('Feedback on the differentiation of the strategy compared to existing market offerings.'),
  focusFeedback: z.string().describe('Feedback on the focus of the strategy on non-customers and new market creation.'),
  valueInnovationFeedback: z.string().describe('Feedback on the sustainability of the value innovation.
'),
  feasibilityFeedback: z.string().describe('Feedback on the feasibility of implementing the strategy.'),
});
export type AnalyzeBlueOceanPotentialOutput = z.infer<typeof AnalyzeBlueOceanPotentialOutputSchema>;

export async function analyzeBlueOceanPotential(input: AnalyzeBlueOceanPotentialInput): Promise<AnalyzeBlueOceanPotentialOutput> {
  return analyzeBlueOceanPotentialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBlueOceanPotentialPrompt',
  input: {schema: AnalyzeBlueOceanPotentialInputSchema},
  output: {schema: AnalyzeBlueOceanPotentialOutputSchema},
  prompt: `You are a Blue Ocean Strategy expert, providing feedback on a user-submitted strategy.

  Analyze the following strategy and provide feedback on its blue ocean potential, covering differentiation, focus, value innovation, and feasibility.  Be brief and to the point.

  Target Market: {{{targetMarket}}}
  Strategy Canvas: {{{strategyCanvas}}}
  Four Actions Grid: {{{fourActionsGrid}}}

  Differentiation Feedback:
  {{#jsonPath output '$.differentiationFeedback'}}
  {{/jsonPath}}

  Focus Feedback:
  {{#jsonPath output '$.focusFeedback'}}
  {{/jsonPath}}

  Value Innovation Feedback:
  {{#jsonPath output '$.valueInnovationFeedback'}}
  {{/jsonPath}}

  Feasibility Feedback:
  {{#jsonPath output '$.feasibilityFeedback'}}
  {{/jsonPath}}
  `,
});

const analyzeBlueOceanPotentialFlow = ai.defineFlow(
  {
    name: 'analyzeBlueOceanPotentialFlow',
    inputSchema: AnalyzeBlueOceanPotentialInputSchema,
    outputSchema: AnalyzeBlueOceanPotentialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
