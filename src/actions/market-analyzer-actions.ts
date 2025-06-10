'use server';

import { getValueInnovationSuggestions, type ValueInnovationSuggestionsInput, type ValueInnovationSuggestionsOutput } from '@/ai/flows/value-innovation-suggestions';

export async function analyzeMarket(industry: string): Promise<ValueInnovationSuggestionsOutput | { error: string }> {
  if (!industry) {
    return { error: 'Industry cannot be empty.' };
  }

  const input: ValueInnovationSuggestionsInput = {
    industry,
    // The getValueInnovationSuggestions flow expects these, but for a general market scan,
    // they might not be available or relevant initially. Passing empty/generic values.
    // A dedicated "market analysis" flow would be more appropriate.
    competitorValueCurves: "General competitor landscape information to be analyzed.",
    customerNeeds: "General customer needs and pain points to be identified.",
  };

  try {
    const result = await getValueInnovationSuggestions(input);
    return result;
  } catch (e) {
    console.error("Error in analyzeMarket action:", e);
    return { error: 'Failed to analyze market. Please try again.' };
  }
}
