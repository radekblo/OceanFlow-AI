'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutGrid, PlusCircle, Trash2, Wand2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ErrcItem {
  id: string;
  text: string;
}

type ErrcCategory = 'eliminate' | 'reduce' | 'raise' | 'create';

const categoryConfig = {
  eliminate: { title: "Eliminate", description: "Which factors that the industry has long competed on should be eliminated?", color: "bg-red-100 border-red-300", textColor: "text-red-700" },
  reduce: { title: "Reduce", description: "Which factors should be reduced well below the industry's standard?", color: "bg-yellow-100 border-yellow-300", textColor: "text-yellow-700" },
  raise: { title: "Raise", description: "Which factors should be raised well above the industry's standard?", color: "bg-blue-100 border-blue-300", textColor: "text-blue-700" },
  create: { title: "Create", description: "Which factors should be created that the industry has never offered?", color: "bg-green-100 border-green-300", textColor: "text-green-700" },
};

export default function ErrcGridPage() {
  const [items, setItems] = useState<Record<ErrcCategory, ErrcItem[]>>({
    eliminate: [],
    reduce: [],
    raise: [],
    create: [],
  });
  const [currentInput, setCurrentInput] = useState<Record<ErrcCategory, string>>({
    eliminate: '',
    reduce: '',
    raise: '',
    create: '',
  });
  const [aiSuggestions, setAiSuggestions] = useState<Record<ErrcCategory, string[]>>({
    eliminate: ["Example: Complex loyalty programs", "Example: Physical instruction manuals"],
    reduce: ["Example: Number of product variations", "Example: Storefront size in low-traffic areas"],
    raise: ["Example: Online customer support speed", "Example: Product durability"],
    create: ["Example: AI-powered personalization features", "Example: Subscription model for traditionally one-off purchases"],
  });


  const handleAddItem = (category: ErrcCategory) => {
    if (currentInput[category].trim() === '') return;
    setItems(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now().toString(), text: currentInput[category].trim() }],
    }));
    setCurrentInput(prev => ({ ...prev, [category]: '' }));
  };

  const handleRemoveItem = (category: ErrcCategory, id: string) => {
    setItems(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id),
    }));
  };

  const handleInputChange = (category: ErrcCategory, value: string) => {
    setCurrentInput(prev => ({ ...prev, [category]: value }));
  };

  // Placeholder for AI suggestion logic
  const getAiSuggestions = (category: ErrcCategory) => {
    // In a real app, this would call an AI service
    // For now, it just returns predefined examples
    alert(`AI suggestions for ${categoryConfig[category].title} would appear here. This feature is illustrative.`);
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><LayoutGrid className="mr-2 h-6 w-6 text-primary" />ERRC Grid (Four Actions Framework)</CardTitle>
          <CardDescription>Systematically explore how to reconstruct buyer value elements across alternative industries to create a new value curve.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-6 bg-primary/10 border-primary/30">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">AI Suggestions Enabled (Illustrative)</AlertTitle>
            <AlertDescription>
              Click the <Wand2 className="inline h-4 w-4" /> icon in each section to get AI-powered suggestions. Note: This is for demonstration purposes.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(categoryConfig) as ErrcCategory[]).map(category => (
              <Card key={category} className={`shadow-md hover:shadow-lg transition-shadow ${categoryConfig[category].color}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className={`font-headline ${categoryConfig[category].textColor}`}>{categoryConfig[category].title}</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => getAiSuggestions(category)} className={categoryConfig[category].textColor}>
                          <Wand2 className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>AI Suggestions for {categoryConfig[category].title}</DialogTitle>
                          <DialogDescription>
                            Here are some AI-generated ideas. Consider how they might apply to your industry.
                          </DialogDescription>
                        </DialogHeader>
                        <ul className="list-disc pl-5 space-y-1 py-4 max-h-60 overflow-y-auto">
                          {aiSuggestions[category].map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                        <DialogFooter>
                          <Button variant="outline" onClick={(e) => (e.target as HTMLElement).closest('[role="dialog"]')?.querySelector('button[aria-label="Close"]')?.click()}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardDescription className={categoryConfig[category].textColor}>{categoryConfig[category].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {items[category].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-background/50 rounded-md text-sm">
                        <span>{item.text}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(category, item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={`Add factor to ${category}...`}
                      value={currentInput[category]}
                      onChange={e => handleInputChange(category, e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddItem(category)}
                      className="bg-white focus:border-primary"
                    />
                    <Button onClick={() => handleAddItem(category)} variant="outline" className="bg-white hover:bg-gray-50 border-gray-300 hover:border-primary text-primary">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
