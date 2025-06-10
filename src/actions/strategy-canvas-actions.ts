'use server';

import { suggestCompetingFactors, type SuggestCompetingFactorsInput, type SuggestCompetingFactorsOutput } from '@/ai/flows/suggest-factors';

export async function getSuggestedFactors(industry: string): Promise<SuggestCompetingFactorsOutput | { error: string }> {
  if (!industry) {
    return { error: 'Industry cannot be empty.' };
  }
  const input: SuggestCompetingFactorsInput = { industry };
  try {
    const result = await suggestCompetingFactors(input);
    return result;
  } catch (e) {
    console.error("Error in getSuggestedFactors action:", e);
    return { error: 'Failed to suggest factors. Please try again.' };
  }
}
