import * as React from "react";
import { Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type GeneratorOptions = {
  prompt: string;
  style: string;
  count: number;
  aspect: string;
};

type PromptFormProps = {
  className?: string;
  defaultPrompt?: string;
  onGenerate: (opts: GeneratorOptions) => void;
  loading?: boolean;
};

const SUGGESTIONS = [
  "Cyberpunk cat",
  "Neon city rain",
  "Fantasy castle",
  "Astronaut in synthwave universe",
  "Glowing circuit dragon",
];

export function PromptForm({ className, defaultPrompt = "", onGenerate, loading }: PromptFormProps) {
  const [prompt, setPrompt] = React.useState(defaultPrompt);
  const [style, setStyle] = React.useState("Realistic");
  const [count, setCount] = React.useState(1);
  const [aspect, setAspect] = React.useState("1:1");

  const canGenerate = prompt.trim().length > 0 && !loading;

  const submit = React.useCallback(() => {
    if (!canGenerate) return;
    onGenerate({ prompt: prompt.trim(), style, count, aspect });
  }, [aspect, canGenerate, count, onGenerate, prompt, style]);

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground" htmlFor="prompt">
            Prompt (required)
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate…"
              className="h-12 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              aria-label="Image prompt"
            />
            <Button
              variant="hero"
              size="xl"
              onClick={submit}
              disabled={!canGenerate}
              className="shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s}
              type="button"
              variant="glass"
              size="sm"
              onClick={() => setPrompt(s)}
              disabled={loading}
              className="h-8"
            >
              {s}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPrompt("Neon-lit developer workstation, cinematic, ultra detailed")}
            disabled={loading}
            className="h-8"
          >
            Try Example Prompt
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Style (UI only)</div>
            <Select value={style} onValueChange={setStyle} disabled={loading}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Realistic",
                  "Anime",
                  "3D",
                  "Cartoon",
                  "Cyberpunk",
                ].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Image count (UI only)</div>
            <Select
              value={String(count)}
              onValueChange={(v) => setCount(Math.max(1, Math.min(4, Number(v) || 1)))}
              disabled={loading}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Count" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Aspect ratio (UI only)</div>
            <Select value={aspect} onValueChange={setAspect} disabled={loading}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Aspect" />
              </SelectTrigger>
              <SelectContent>
                {["1:1", "16:9", "9:16"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Tip: Press <span className="font-semibold text-foreground">Enter</span> to generate.
        </div>
      </CardContent>
    </Card>
  );
}
