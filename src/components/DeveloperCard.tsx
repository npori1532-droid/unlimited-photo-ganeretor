import { Facebook, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeveloperCard() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-hero">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient text-3xl">Developer Tech Master</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">Follow for more tools & bots</p>
        </CardHeader>
      </div>

      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <Button asChild variant="glass" className="justify-start">
            <a href="https://t.me/tech_master_a2z" target="_blank" rel="noreferrer">
              <Send className="h-4 w-4" />
              Telegram Channel
            </a>
          </Button>

          <Button asChild variant="glass" className="justify-start">
            <a href="https://t.me/tech_chatx" target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Telegram Group
            </a>
          </Button>

          <Button asChild variant="glass" className="justify-start">
            <a
              href="https://www.facebook.com/share/1CDQpzVkjm/"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
          </Button>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
          <div className="text-sm">
            Built with <span className="text-gradient font-semibold">❤️</span> by <span className="font-semibold">Developer Tech Master</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Unlimited AI Image Generator — powered by the public API.</div>
        </div>
      </CardContent>
    </Card>
  );
}
