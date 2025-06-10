'use client';

import { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, Wand2, BarChartHorizontalBig, FileText, Users, CheckCircle, XCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getBlueOceanAnalysis } from '@/actions/value-innovation-actions';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

interface CompetingFactor {
  id: string;
  name: string;
  level: number;
}

interface AnalysisResult {
  differentiationFeedback: string;
  focusFeedback: string;
  valueInnovationFeedback: string;
  feasibilityFeedback: string;
}

const initialFactors: CompetingFactor[] = [
  { id: 'price', name: 'Price', level: 3 },
  { id: 'features', name: 'Key Features', level: 4 },
  { id: 'simplicity', name: 'Simplicity/Ease of Use', level: 5 },
  { id: 'service', name: 'Customer Service', level: 2 },
  { id: 'novelty', name: 'Novelty/Uniqueness', level: 4 },
];

const MAX_LEVEL = 5;

export default function ValueInnovationCanvasPage() {
  const [factors, setFactors] = useState<CompetingFactor[]>(initialFactors);
  const [targetMarket, setTargetMarket] = useState('');
  const [strategyCanvasDescription, setStrategyCanvasDescription] = useState('');
  const [fourActionsGridDescription, setFourActionsGridDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, startTransition] = useTransition();
  const { toast } = useToast();
  
  const handleFactorLevelChange = (id: string, value: number[]) => {
    setFactors(
      factors.map(factor =>
        factor.id === id ? { ...factor, level: value[0] } : factor
      )
    );
  };

  const handleSubmitForAnalysis = async () => {
    if (!targetMarket || !strategyCanvasDescription || !fourActionsGridDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in Target Market, Strategy Canvas summary, and ERRC Grid summary.",
        variant: "destructive",
      });
      return;
    }

    // Construct a simplified string representation of the current value curve for the AI
    const currentStrategyCanvasForAI = factors.map(f => `${f.name}: Level ${f.level}`).join(', ');

    startTransition(async () => {
      setAnalysisResult(null);
      const result = await getBlueOceanAnalysis({
        targetMarket,
        strategyCanvas: `Proposed Strategy: ${currentStrategyCanvasForAI}. Additional Context: ${strategyCanvasDescription}`,
        fourActionsGrid: fourActionsGridDescription,
      });
      if ('error' in result) {
        toast({ title: "Analysis Failed", description: result.error, variant: "destructive" });
      } else {
        setAnalysisResult(result);
        toast({ title: "Analysis Complete", description: "AI feedback on your strategy is available." });
      }
    });
  };

  const chartData = factors.map(f => ({ name: f.name, 'Proposed Value': f.level }));
  
  const renderFeedbackSection = (title: string, feedback: string | undefined, Icon: React.ElementType) => {
    if (!feedback) return null;
    const isPositive = feedback.toLowerCase().includes("strong") || feedback.toLowerCase().includes("well") || feedback.toLowerCase().includes("clear");
    const FeedbackIcon = isPositive ? CheckCircle : XCircle;
    const iconColor = isPositive ? "text-green-500" : "text-red-500";

    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold flex items-center">
            <Icon className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-start">
          <FeedbackIcon className={`mr-2 h-5 w-5 ${iconColor} flex-shrink-0 mt-1`} />
          <p className="text-sm text-foreground">{feedback}</p>
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-primary" />Value Innovation Canvas</CardTitle>
          <CardDescription>Design your new value curve. Adjust factor levels and get AI feedback on your Blue Ocean potential.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Define Your New Value Curve</h3>
            <div className="space-y-4">
              {factors.map(factor => (
                <div key={factor.id} className="p-3 border rounded-md bg-card">
                  <Label htmlFor={`factor-${factor.id}`} className="text-sm font-medium">{factor.name}: <span className="font-bold text-primary">{factor.level}</span></Label>
                  <Slider
                    id={`factor-${factor.id}`}
                    min={1} max={MAX_LEVEL} step={1}
                    defaultValue={[factor.level]}
                    onValueChange={(value) => handleFactorLevelChange(factor.id, value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full p-4 rounded-lg border bg-card shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} tick={{ fontSize: 10 }} stroke="hsl(var(--foreground))" />
                <YAxis domain={[0, MAX_LEVEL + 1]} allowDataOverflow stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                <Legend wrapperStyle={{fontSize: "12px"}} />
                <Line type="monotone" dataKey="Proposed Value" stroke="hsl(var(--chart-1))" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">AI Strategy Validation</CardTitle>
          <CardDescription>Provide context about your strategy and target market for AI analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="target-market" className="text-md font-medium">Target Market / Industry</Label>
            <Input id="target-market" value={targetMarket} onChange={e => setTargetMarket(e.target.value)} placeholder="e.g., Urban commuters aged 25-40" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="strategy-canvas-desc" className="text-md font-medium">Brief Summary of Your Current Strategy Canvas (Optional Context)</Label>
            <Textarea id="strategy-canvas-desc" value={strategyCanvasDescription} onChange={e => setStrategyCanvasDescription(e.target.value)} placeholder="Describe your current understanding of industry factors and competitor positions." className="mt-1" rows={3}/>
          </div>
          <div>
            <Label htmlFor="errc-grid-desc" className="text-md font-medium">Key Outputs from Your ERRC Grid</Label>
            <Textarea id="errc-grid-desc" value={fourActionsGridDescription} onChange={e => setFourActionsGridDescription(e.target.value)} placeholder="Summarize what you plan to Eliminate, Reduce, Raise, and Create." className="mt-1" rows={4}/>
          </div>
          <Button onClick={handleSubmitForAnalysis} disabled={isAnalyzing} className="w-full sm:w-auto">
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Analyze Blue Ocean Potential
          </Button>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-muted-foreground">AI is analyzing your strategy...</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-headline">AI Feedback on Your Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFeedbackSection("Differentiation", analysisResult.differentiationFeedback, BarChartHorizontalBig)}
            {renderFeedbackSection("Focus (Non-customers & New Markets)", analysisResult.focusFeedback, Users)}
            {renderFeedbackSection("Value Innovation Sustainability", analysisResult.valueInnovationFeedback, Lightbulb)}
            {renderFeedbackSection("Implementation Feasibility", analysisResult.feasibilityFeedback, FileText)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
