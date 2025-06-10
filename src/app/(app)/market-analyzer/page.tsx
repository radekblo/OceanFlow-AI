'use client';

import { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Search, Milestone } from "lucide-react";
import type { ValueInnovationSuggestionsOutput } from '@/ai/flows/value-innovation-suggestions';
import { analyzeMarket } from '@/actions/market-analyzer-actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function MarketAnalyzerPage() {
  const [industry, setIndustry] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ValueInnovationSuggestionsOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!industry.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an industry to analyze.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      setAnalysisResult(null);
      const result = await analyzeMarket(industry);
      if ('error' in result) {
        toast({
          title: "Analysis Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setAnalysisResult(result);
        toast({
          title: "Analysis Complete",
          description: "Market insights generated successfully.",
        });
      }
    });
  };
  
  // Placeholder data for the chart
  const chartData = [
    { name: 'Red Ocean Factors', value: 70, fill: 'hsl(var(--destructive))' },
    { name: 'Blue Ocean Potential', value: 30, fill: 'hsl(var(--primary))' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><Search className="mr-2 h-6 w-6 text-primary" />AI Market Analyzer</CardTitle>
          <CardDescription>Enter your target industry to receive an AI-powered market analysis, identifying competitive landscapes, trends, and potential Blue Ocean opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="industry" className="text-lg font-medium">Target Industry / Business Sector</Label>
              <Input
                id="industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Electric Vehicle Manufacturing, Boutique Coffee Shops"
                className="mt-1 text-base"
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Analyze Market
            </Button>
          </form>
        </CardContent>
      </Card>

      {isPending && (
        <Card className="shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing market data... This may take a moment.</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Market Analysis Results for: <span className="text-primary">{industry}</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Interpreting Results</AlertTitle>
              <AlertDescription>
                The following suggestions highlight potential areas for value innovation based on the AI's understanding of market gaps and customer needs. This is a starting point for deeper strategic exploration.
              </AlertDescription>
            </Alert>

            {analysisResult.suggestions && analysisResult.suggestions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border-b border-border">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center">
                        <Milestone className="mr-3 h-5 w-5 text-accent flex-shrink-0" />
                        <span className="font-medium text-primary-foreground bg-primary px-2 py-1 rounded-md text-sm mr-2 hidden md:inline">Factor:</span>
                        <span className="font-semibold text-foreground">{suggestion.factor}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pl-4 text-sm">
                      <p><strong className="text-muted-foreground">Opportunity:</strong> {suggestion.opportunity}</p>
                      <p><strong className="text-muted-foreground">Rationale:</strong> {suggestion.rationale}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">No specific value innovation suggestions were generated for this industry at the moment. Consider refining your industry input or exploring broader strategic frameworks.</p>
            )}
             <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-center font-headline">Market Saturation Overview (Illustrative)</h3>
                <div className="h-[300px] w-full rounded-lg border p-4 bg-card shadow-sm">
                   <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--foreground))" fontSize={12}/>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                        labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                      />
                      <Legend wrapperStyle={{fontSize: "12px"}}/>
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">This is a conceptual visualization. Actual market dynamics are more complex.</p>
              </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
