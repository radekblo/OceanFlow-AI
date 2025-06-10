'use server';

import { analyzeBlueOceanPotential, type AnalyzeBlueOceanPotentialInput, type AnalyzeBlueOceanPotentialOutput } from '@/ai/flows/analyze-blue-ocean-potential';

export async function getBlueOceanAnalysis(input: AnalyzeBlueOceanPotentialInput): Promise<AnalyzeBlueOceanPotentialOutput | { error: string }> {
  if (!input.strategyCanvas || !input.fourActionsGrid || !input.targetMarket) {
    return { error: 'All fields (Strategy Canvas, ERRC Grid, Target Market) are required for analysis.' };
  }
  try {
    const result = await analyzeBlueOceanPotential(input);
    return result;
  } catch (e) {
    console.error("Error in getBlueOceanAnalysis action:", e);
    return { error: 'Failed to analyze blue ocean potential. Please try again.' };
  }
}
