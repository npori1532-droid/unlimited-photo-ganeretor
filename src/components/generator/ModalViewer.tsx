import * as React from "react";
import { Download, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MagicImage } from "@/lib/magicstudio";

type ModalViewerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image?: MagicImage;
};

function downloadSrc(src: string, fileName: string) {
  const a = document.createElement("a");
  a.href = src;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function ModalViewer({ open, onOpenChange, image }: ModalViewerProps) {
  const title = image ? "Generated Image" : "Image";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="line-clamp-2">{image?.prompt}</DialogDescription>
        </DialogHeader>

        {image ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-border/70">
              <img
                src={image.src}
                alt={`Generated image for prompt: ${image.prompt}`}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="glass"
                onClick={() => {
                  downloadSrc(image.src, `developer-tech-master-${new Date().toISOString()}.png`);
                  toast.success("Download started");
                }}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button
                type="button"
                variant="hero"
                onClick={async () => {
                  await navigator.clipboard.writeText(image.src);
                  toast.success("Copied!");
                }}
              >
                <LinkIcon className="h-4 w-4" />
                Copy image link
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No image selected.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
