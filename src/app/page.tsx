
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary text-primary-foreground">
            <Waves className="w-12 h-12" />
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-primary">OceanFlow AI</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Navigate Your Business to Uncontested Market Space with AI-Powered Blue Ocean Strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 p-8">
          <p className="text-center text-foreground">
            Transform complex strategic planning into an intuitive, AI-powered experience. 
            Leverage Google's Gemini API to uncover market insights, design innovative value curves, and craft your winning strategy.
          </p>
          <Link href="/market-analyzer">
            <Button size="lg" className="font-semibold text-lg px-8 py-6">
              Start Exploring
            </Button>
          </Link>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} OceanFlow AI. Inspired by Blue Ocean Strategy.</p>
      </footer>
    </div>
  );
}
