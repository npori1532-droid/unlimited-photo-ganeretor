export type MagicImage = {
  src: string;
  prompt: string;
  createdAt: string;
};

const API_BASE = "https://free-goat-api.onrender.com/magicstudio";

function isProbablyUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

function isDataImage(v: string) {
  return /^data:image\//i.test(v);
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function findFirstString(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (!value) return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstString(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof value === "object") {
    for (const k of ["image", "img", "url", "output", "result", "data"]) {
      const v = (value as Record<string, unknown>)[k];
      const found = findFirstString(v);
      if (found) return found;
    }
    for (const v of Object.values(value as Record<string, unknown>)) {
      const found = findFirstString(v);
      if (found) return found;
    }
  }
  return null;
}

export async function generateMagicImage(prompt: string): Promise<string> {
  const url = `${API_BASE}?prompt=${encodeURIComponent(prompt)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error (${res.status})`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.startsWith("image/")) {
    const blob = await res.blob();
    return await blobToDataUrl(blob);
  }

  // Try JSON first
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    const str = findFirstString(json);
    if (!str) throw new Error("No image found in JSON payload");
    return str;
  } catch {
    // Plain text response: could be a URL or a data URI
    const candidate = text.trim();
    if (isProbablyUrl(candidate) || isDataImage(candidate)) return candidate;
    throw new Error("Unexpected API response format");
  }
}
