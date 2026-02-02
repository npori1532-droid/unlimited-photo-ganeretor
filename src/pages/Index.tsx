import * as React from "react";
import { ImageIcon, Zap } from "lucide-react";
import { toast } from "sonner";

import { DeveloperCard } from "@/components/DeveloperCard";
import { NeonField } from "@/components/NeonField";
import { ImageGrid } from "@/components/generator/ImageGrid";
import { ModalViewer } from "@/components/generator/ModalViewer";
import { PromptForm, type GeneratorOptions } from "@/components/generator/PromptForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useImageHistory } from "@/hooks/use-image-history";
import { generateMagicImage, type MagicImage } from "@/lib/magicstudio";

const Index = () => {
  const { items: history, add: addToHistory, clear: clearHistory } = useImageHistory(32);

  const [latest, setLatest] = React.useState<MagicImage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalImage, setModalImage] = React.useState<MagicImage | undefined>(undefined);

  const onOpenLatest = (index: number) => {
    setModalImage(latest[index]);
    setModalOpen(true);
  };

  const onOpenHistory = (index: number) => {
    setModalImage(history[index]);
    setModalOpen(true);
  };

  const generate = React.useCallback(async (opts: GeneratorOptions) => {
    const prompt = opts.prompt.trim();
    if (!prompt) return;

    setError(null);
    setLoading(true);
    setProgress(8);

    let timer: number | null = null;
    timer = window.setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.max(1, Math.round((92 - p) / 12)) : p));
    }, 220);

    try {
      const count = Math.max(1, Math.min(4, opts.count || 1));
      const results = await Promise.all(
        Array.from({ length: count }).map(async () => {
          const src = await generateMagicImage(prompt);
          return {
            src,
            prompt,
            createdAt: new Date().toISOString(),
          } satisfies MagicImage;
        }),
      );

      setLatest(results);
      addToHistory(results);
      toast.success("Image generated!");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      toast.error("Could not generate image");
    } finally {
      if (timer) window.clearInterval(timer);
      setProgress(100);
      window.setTimeout(() => setProgress(0), 450);
      setLoading(false);
    }
  }, [addToHistory]);

  return (
    <div className="min-h-screen">
      <NeonField className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/55 backdrop-blur-xl">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/40 shadow-glow">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Developer Tech Master</div>
                <div className="text-xs text-muted-foreground">Unlimited AI Image Generator</div>
              </div>
            </div>

            <Badge className="gap-1" aria-label="Unlimited badge">
              <Zap className="h-3.5 w-3.5" />
              Unlimited
            </Badge>
          </div>
        </header>

        <main className="container py-8">
          <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-background/35 p-6 shadow-glow backdrop-blur-xl md:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  <span className="text-gradient">Developer Tech Master</span>
                </h1>
                <p className="text-pretty text-base text-muted-foreground md:text-lg">
                  Unlimited AI Image Generator — Create stunning images from text prompts.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => {
                      const el = document.getElementById("generator");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Generate now
                  </Button>
                  <Button
                    variant="glass"
                    size="xl"
                    onClick={() => {
                      const el = document.getElementById("gallery");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    View Gallery
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <PromptForm onGenerate={generate} loading={loading} />

                {progress > 0 ? (
                  <div className="glass-soft overflow-hidden rounded-xl p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Generating…</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <Card className="p-4">
                    <div className="text-sm font-semibold">Couldn’t generate an image</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {error}. Please try a different prompt.
                    </div>
                  </Card>
                ) : null}
              </div>
            </div>
          </section>

          <section id="generator" className="mt-10 space-y-6">
            <ImageGrid title="Results" images={latest} onOpen={onOpenLatest} />
          </section>

          <section id="gallery" className="mt-12 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Gallery</h2>
                <p className="mt-1 text-sm text-muted-foreground">Last generated images (saved in your browser).</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  clearHistory();
                  toast.success("Gallery cleared");
                }}
                disabled={history.length === 0}
              >
                Clear gallery
              </Button>
            </div>

            <ImageGrid title="History" images={history} onOpen={onOpenHistory} />
          </section>

          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">Developer Info</h2>
            <DeveloperCard />
          </section>
        </main>

        <footer className="border-t border-border/70 bg-background/45 backdrop-blur-xl">
          <div className="container py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">© 2026 Developer Tech Master</div>
                <div className="mt-1 text-xs text-muted-foreground">Generated images depend on the API response.</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="glass" size="sm">
                  <a href="https://t.me/tech_master_a2z" target="_blank" rel="noreferrer">
                    Telegram Channel
                  </a>
                </Button>
                <Button asChild variant="glass" size="sm">
                  <a href="https://t.me/tech_chatx" target="_blank" rel="noreferrer">
                    Telegram Group
                  </a>
                </Button>
                <Button asChild variant="glass" size="sm">
                  <a href="https://www.facebook.com/share/1CDQpzVkjm/" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </footer>

        <ModalViewer open={modalOpen} onOpenChange={setModalOpen} image={modalImage} />
      </NeonField>
    </div>
  );
};

export default Index;
