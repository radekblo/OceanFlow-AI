'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Map as MapIcon, Edit3, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

const buyerExperienceCycle = [
  "Purchase",
  "Delivery",
  "Use",
  "Supplements",
  "Maintenance",
  "Disposal",
] as const;

const utilityLevers = [
  "Customer Productivity",
  "Simplicity",
  "Convenience",
  "Risk Reduction",
  "Fun & Image",
  "Environmental Friendliness",
] as const;

type BuyerExperienceStage = typeof buyerExperienceCycle[number];
type UtilityLever = typeof utilityLevers[number];

interface CellData {
  text: string;
  isOpportunity: boolean;
}

type UtilityMapData = Record<BuyerExperienceStage, Record<UtilityLever, CellData>>;

const initialMapData = () => {
  const data: Partial<UtilityMapData> = {};
  for (const stage of buyerExperienceCycle) {
    data[stage] = {} as Record<UtilityLever, CellData>;
    for (const lever of utilityLevers) {
      data[stage]![lever] = { text: '', isOpportunity: false };
    }
  }
  return data as UtilityMapData;
};

export default function BuyerUtilityMapPage() {
  const [mapData, setMapData] = useState<UtilityMapData>(initialMapData());
  const [editingCell, setEditingCell] = useState<{ stage: BuyerExperienceStage; lever: UtilityLever } | null>(null);
  const [editText, setEditText] = useState('');

  const handleCellClick = (stage: BuyerExperienceStage, lever: UtilityLever) => {
    setEditingCell({ stage, lever });
    setEditText(mapData[stage][lever].text);
  };

  const handleSaveEdit = () => {
    if (editingCell) {
      const newMapData = { ...mapData };
      newMapData[editingCell.stage][editingCell.lever].text = editText;
      setMapData(newMapData);
      setEditingCell(null);
    }
  };
  
  const toggleOpportunity = (stage: BuyerExperienceStage, lever: UtilityLever) => {
     if (editingCell && editingCell.stage === stage && editingCell.lever === lever) {
      // If currently editing this cell, update mapData directly before closing dialog
      const newMapData = { ...mapData };
      newMapData[stage][lever].isOpportunity = !newMapData[stage][lever].isOpportunity;
      newMapData[stage][lever].text = editText; // Ensure current text is saved
      setMapData(newMapData);
      setEditingCell(null); // Close dialog
    } else {
      // If not editing this cell, or editing a different cell
      const newMapData = { ...mapData };
      newMapData[stage][lever].isOpportunity = !newMapData[stage][lever].isOpportunity;
      setMapData(newMapData);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><MapIcon className="mr-2 h-6 w-6 text-primary" />Buyer Utility Map</CardTitle>
          <CardDescription>Identify blocks to buyer utility across the entire buyer experience cycle. Click on a cell to add notes or mark it as an opportunity.</CardDescription>
        </CardHeader>
        <CardContent>
           <Alert variant="default" className="mb-6 bg-accent/20 border-accent/40">
            <AlertTriangle className="h-4 w-4 text-accent-foreground" />
            <AlertTitle className="font-semibold text-accent-foreground">Identify Opportunities</AlertTitle>
            <AlertDescription>
              Focus on cells where current industry offerings are weak or non-existent. These are potential Blue Oceans. Use the <Edit3 className="inline h-3 w-3" /> icon to add notes and toggle opportunity status.
            </AlertDescription>
          </Alert>
          <div className="overflow-x-auto rounded-lg border">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] bg-muted/50 sticky left-0 z-10">Experience Stage</TableHead>
                  {utilityLevers.map(lever => (
                    <TableHead key={lever} className="text-center font-semibold min-w-[150px]">{lever}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {buyerExperienceCycle.map(stage => (
                  <TableRow key={stage}>
                    <TableHead className="font-semibold bg-muted/50 sticky left-0 z-10">{stage}</TableHead>
                    {utilityLevers.map(lever => (
                      <TableCell
                        key={lever}
                        className={`min-w-[150px] p-1.5 align-top hover:bg-primary/5 transition-colors ${mapData[stage][lever].isOpportunity ? 'bg-accent/30 ring-2 ring-accent' : ''}`}
                      >
                        <Dialog open={editingCell?.stage === stage && editingCell?.lever === lever} onOpenChange={(isOpen) => !isOpen && setEditingCell(null)}>
                          <DialogTrigger asChild>
                            <button 
                              className="w-full h-24 text-left p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              onClick={() => handleCellClick(stage, lever)}
                            >
                              <div className="flex justify-end mb-1">
                                <Edit3 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </div>
                              <p className="text-xs line-clamp-4 break-words">{mapData[stage][lever].text || <span className="text-muted-foreground italic">Empty</span>}</p>
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Cell: {stage} - {lever}</DialogTitle>
                              <DialogDescription>Add your observations or ideas for this utility block.</DialogDescription>
                            </DialogHeader>
                            <Textarea
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              rows={5}
                              className="my-4"
                            />
                            <div className="flex items-center space-x-2 my-2">
                                <input
                                  type="checkbox"
                                  id={`opportunity-${stage}-${lever}`}
                                  checked={mapData[stage][lever].isOpportunity}
                                  onChange={() => {
                                    const newMapData = { ...mapData };
                                    newMapData[stage][lever].isOpportunity = !newMapData[stage][lever].isOpportunity;
                                    setMapData(newMapData);
                                  }}
                                  className="h-4 w-4 text-accent rounded border-gray-300 focus:ring-accent"
                                />
                                <Label htmlFor={`opportunity-${stage}-${lever}`} className="text-sm font-medium text-gray-700">
                                  Mark as Opportunity
                                </Label>
                              </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingCell(null)}>Cancel</Button>
                              <Button onClick={handleSaveEdit}>Save</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
