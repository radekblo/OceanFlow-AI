'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, PlusCircle, Trash2, Lightbulb, TrendingUp, Anchor, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Offering {
  id: string;
  name: string;
}

type PmsCategory = 'pioneers' | 'migrators' | 'settlers';

const categoryConfig = {
  pioneers: { title: "Pioneers", description: "Value innovations; today's businesses with strong Blue Ocean potential.", icon: Lightbulb, color: "bg-primary/10 border-primary text-primary-foreground", titleColor: "text-primary" },
  migrators: { title: "Migrators", description: "Value improvements; businesses extending current industry trajectory.", icon: TrendingUp, color: "bg-accent/20 border-accent text-accent-foreground", titleColor: "text-accent-foreground"},
  settlers: { title: "Settlers", description: "Value imitations; 'me-too' businesses converging with competitors.", icon: Anchor, color: "bg-destructive/10 border-destructive text-destructive-foreground", titleColor: "text-destructive" },
};

export default function PmsMapPage() {
  const [offerings, setOfferings] = useState<Record<PmsCategory, Offering[]>>({
    pioneers: [],
    migrators: [],
    settlers: [],
  });
  const [currentInput, setCurrentInput] = useState<Record<PmsCategory, string>>({
    pioneers: '',
    migrators: '',
    settlers: '',
  });

  const handleAddOffering = (category: PmsCategory) => {
    if (currentInput[category].trim() === '') return;
    setOfferings(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now().toString(), name: currentInput[category].trim() }],
    }));
    setCurrentInput(prev => ({ ...prev, [category]: '' }));
  };

  const handleRemoveOffering = (category: PmsCategory, id: string) => {
    setOfferings(prev => ({
      ...prev,
      [category]: prev[category].filter(offering => offering.id !== id),
    }));
  };

  const handleInputChange = (category: PmsCategory, value: string) => {
    setCurrentInput(prev => ({ ...prev, [category]: value }));
  };
  
  // Placeholder for AI recommendations
  const getAiRecommendations = () => {
    alert("AI would analyze your portfolio and suggest shifts towards pioneer offerings. This feature is illustrative.");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />Pioneer-Migrator-Settler Map</CardTitle>
          <CardDescription>Categorize your current and potential business offerings to understand your portfolio's growth trajectory and identify areas for Blue Ocean creation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold">Portfolio Analysis</AlertTitle>
            <AlertDescription>
              A healthy portfolio has a balance across all three types, with a focus on cultivating more Pioneers for future growth. AI can help identify how to shift Settlers and Migrators.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(Object.keys(categoryConfig) as PmsCategory[]).map(category => {
              const config = categoryConfig[category];
              return (
                <Card key={category} className={`shadow-md hover:shadow-lg transition-shadow border-2 ${config.color}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <config.icon className={`h-6 w-6 ${config.titleColor}`} />
                      <CardTitle className={`font-headline ${config.titleColor}`}>{config.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">{config.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4 min-h-[100px]">
                      {offerings[category].map(offering => (
                        <div key={offering.id} className="flex items-center justify-between p-2 bg-background/70 rounded-md text-sm shadow-sm">
                          <span className="text-foreground">{offering.name}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveOffering(category, offering.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                       {offerings[category].length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">No offerings listed in this category yet.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={`Add to ${config.title}...`}
                        value={currentInput[category]}
                        onChange={e => handleInputChange(category, e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddOffering(category)}
                        className="bg-background focus:border-primary"
                      />
                      <Button 
                        onClick={() => handleAddOffering(category)} 
                        variant="outline" 
                        className={`bg-background hover:bg-muted border-gray-300 hover:border-${categoryConfig[category].titleColor} ${categoryConfig[category].titleColor}`}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Button onClick={getAiRecommendations} size="lg">
              <Lightbulb className="mr-2 h-5 w-5" /> Get AI Portfolio Recommendations (Illustrative)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
