import * as React from "react";

import type { MagicImage } from "@/lib/magicstudio";

const STORAGE_KEY = "dtm_image_history_v1";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function useImageHistory(maxItems = 24) {
  const [items, setItems] = React.useState<MagicImage[]>(() => {
    const parsed = safeParse<MagicImage[]>(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = React.useCallback(
    (next: MagicImage | MagicImage[]) => {
      const list = Array.isArray(next) ? next : [next];
      setItems((prev) => {
        const merged = [...list, ...prev].slice(0, maxItems);
        return merged;
      });
    },
    [maxItems],
  );

  const clear = React.useCallback(() => setItems([]), []);

  return { items, add, clear };
}
