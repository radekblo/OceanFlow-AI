'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart as LucideLineChart, Loader2, PlusCircle, Trash2, Wand2, Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getSuggestedFactors } from '@/actions/strategy-canvas-actions';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

interface CompetingFactor {
  id: string;
  name: string;
  userLevel: number;
  competitorALevel: number;
  competitorBLevel: number;
}

const initialFactors: CompetingFactor[] = [
  { id: '1', name: 'Price', userLevel: 3, competitorALevel: 4, competitorBLevel: 5 },
  { id: '2', name: 'Quality', userLevel: 4, competitorALevel: 3, competitorBLevel: 4 },
  { id: '3', name: 'Service', userLevel: 5, competitorALevel: 2, competitorBLevel: 3 },
];

const MAX_LEVEL = 5; // Max offering level

export default function StrategyCanvasPage() {
  const [industry, setIndustry] = useState('');
  const [factors, setFactors] = useState<CompetingFactor[]>(initialFactors);
  const [newFactorName, setNewFactorName] = useState('');
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useTransition();
  const { toast } = useToast();

  const handleAddFactor = () => {
    if (newFactorName.trim() === '') {
      toast({ title: "Error", description: "Factor name cannot be empty.", variant: "destructive" });
      return;
    }
    setFactors([
      ...factors,
      {
        id: Date.now().toString(),
        name: newFactorName,
        userLevel: 1,
        competitorALevel: 1,
        competitorBLevel: 1,
      },
    ]);
    setNewFactorName('');
  };

  const handleRemoveFactor = (id: string) => {
    setFactors(factors.filter(factor => factor.id !== id));
  };

  const handleFactorChange = (id: string, field: keyof CompetingFactor, value: string | number) => {
    setFactors(
      factors.map(factor =>
        factor.id === id ? { ...factor, [field]: typeof value === 'number' ? value : parseInt(value) || 0 } : factor
      )
    );
  };
  
  const handleSliderChange = (id: string, field: 'userLevel' | 'competitorALevel' | 'competitorBLevel', value: number[]) => {
    handleFactorChange(id, field, value[0]);
  };

  const fetchSuggestions = () => {
    if (!industry.trim()) {
      toast({ title: "Industry Required", description: "Please enter an industry to get factor suggestions.", variant: "destructive" });
      return;
    }
    setIsFetchingSuggestions(async () => {
      const result = await getSuggestedFactors(industry);
      if ('error'in result) {
        toast({ title: "Error", description: result.error, variant: "destructive"});
      } else if (result.competingFactors && result.competingFactors.length > 0) {
        const newAISuggestions = result.competingFactors.map(name => ({
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          userLevel: 1,
          competitorALevel: 1,
          competitorBLevel: 1,
        }));
        setFactors(prevFactors => [...prevFactors, ...newAISuggestions.filter(nf => !prevFactors.some(pf => pf.name.toLowerCase() === nf.name.toLowerCase()))]);
        toast({ title: "Suggestions Added", description: "AI-suggested factors have been added to your list." });
      } else {
        toast({ title: "No New Suggestions", description: "No new unique factors were suggested for this industry." });
      }
    });
  };

  const chartData = factors.map(f => ({
    name: f.name,
    'Your Company': f.userLevel,
    'Competitor A': f.competitorALevel,
    'Competitor B': f.competitorBLevel,
  }));

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><LucideLineChart className="mr-2 h-6 w-6 text-primary" />Strategy Canvas</CardTitle>
          <CardDescription>Plot your industry's competing factors and visualize value curves against competitors. Use AI to suggest relevant factors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <Label htmlFor="industry-input">Industry for Factor Suggestions</Label>
              <Input 
                id="industry-input"
                placeholder="e.g., Ride-sharing services" 
                value={industry} 
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={fetchSuggestions} disabled={isFetchingSuggestions || !industry.trim()} className="self-end mt-1 md:mt-0">
              {isFetchingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Get AI Factor Suggestions
            </Button>
          </div>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>How to Use</AlertTitle>
            <AlertDescription>
              List the key factors your industry competes on. Then, score your company and key competitors on each factor from 1 (Low Offering) to {MAX_LEVEL} (High Offering).
            </AlertDescription>
          </Alert>

          <div className="space-y-4 mb-6">
            {factors.map(factor => (
              <Card key={factor.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg text-foreground">{factor.name}</h4>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveFactor(factor.id)} aria-label={`Remove ${factor.name}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: 'Your Company', field: 'userLevel', color: 'hsl(var(--chart-1))' },
                    { label: 'Competitor A', field: 'competitorALevel', color: 'hsl(var(--chart-2))' },
                    { label: 'Competitor B', field: 'competitorBLevel', color: 'hsl(var(--chart-3))' },
                  ].map(entity => (
                    <div key={entity.field} className="space-y-1">
                      <Label htmlFor={`${factor.id}-${entity.field}`} style={{color: entity.color}}>{entity.label}: {factor[entity.field as keyof CompetingFactor]}</Label>
                      <Slider
                        id={`${factor.id}-${entity.field}`}
                        min={1} max={MAX_LEVEL} step={1}
                        defaultValue={[factor[entity.field as keyof CompetingFactor] as number]}
                        onValueChange={(value) => handleSliderChange(factor.id, entity.field as 'userLevel' | 'competitorALevel' | 'competitorBLevel', value)}
                        className="[&_[role=slider]]:bg-[var(--slider-thumb-color)]"
                        style={{ '--slider-thumb-color': entity.color } as React.CSSProperties}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 border-dashed">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg">Add New Competing Factor</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-grow">
                <Label htmlFor="new-factor-name">Factor Name</Label>
                <Input
                  id="new-factor-name"
                  value={newFactorName}
                  onChange={e => setNewFactorName(e.target.value)}
                  placeholder="e.g., Customer Support, Ease of Use"
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddFactor} variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Factor
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Value Curve Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          {factors.length > 0 ? (
            <div className="h-[400px] w-full p-4 rounded-lg border bg-card">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} stroke="hsl(var(--foreground))" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, MAX_LEVEL + 1]} allowDataOverflow stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                  <Line type="monotone" dataKey="Your Company" stroke="hsl(var(--chart-1))" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Competitor A" stroke="hsl(var(--chart-2))" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Competitor B" stroke="hsl(var(--chart-3))" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">Add competing factors to see the value curve.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
