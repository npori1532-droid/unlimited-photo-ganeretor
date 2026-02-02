import { Download, Link as LinkIcon, Maximize2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MagicImage } from "@/lib/magicstudio";

type ImageGridProps = {
  title: string;
  images: MagicImage[];
  onOpen: (index: number) => void;
};

function downloadSrc(src: string, fileName: string) {
  const a = document.createElement("a");
  a.href = src;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function ImageGrid({ title, images, onOpen }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-2 text-lg font-semibold">No images yet</div>
        <p className="mt-1 text-sm text-muted-foreground">Generate an image above and it will show up here.</p>
      </Card>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-lg font-semibold">{images.length} image(s)</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <Card key={`${img.createdAt}-${i}`} className="group relative overflow-hidden p-0">
            <button
              type="button"
              onClick={() => onOpen(i)}
              className="block w-full focus-ring"
              aria-label={`Open image ${i + 1}`}
            >
              <img
                src={img.src}
                alt={`Generated image for prompt: ${img.prompt}`}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-background/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                type="button"
                variant="glass"
                size="sm"
                onClick={() => onOpen(i)}
                className="pointer-events-auto h-8"
              >
                <Maximize2 className="h-4 w-4" />
                View
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="glass"
                  size="icon"
                  onClick={() => {
                    downloadSrc(img.src, `developer-tech-master-${i + 1}.png`);
                    toast.success("Download started");
                  }}
                  className="pointer-events-auto h-8 w-8"
                  aria-label="Download image"
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="glass"
                  size="icon"
                  onClick={async () => {
                    await navigator.clipboard.writeText(img.src);
                    toast.success("Copied!");
                  }}
                  className="pointer-events-auto h-8 w-8"
                  aria-label="Copy image link"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
