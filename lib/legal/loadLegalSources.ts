import fs from "node:fs";
import path from "node:path";
import type { AuthoritativeLegalSource } from "@/types/legal";
import { AuthoritativeLegalSourceArraySchema } from "./legalSourceSchema";
import { fallbackHardcodedLegalSources } from "./mainlandChinaLegalSources";

let cachedSources: AuthoritativeLegalSource[] | null = null;

export function loadLegalSources(): AuthoritativeLegalSource[] {
  if (cachedSources) {
    return cachedSources;
  }

  const loaded = loadFromJsonFiles();
  cachedSources = loaded.length ? loaded : fallbackHardcodedLegalSources;
  return cachedSources;
}

function loadFromJsonFiles() {
  const dataDir = path.join(process.cwd(), "data", "legal-sources");

  try {
    if (!fs.existsSync(dataDir)) {
      warnInDevelopment("legal source data directory not found; using hardcoded fallback");
      return [];
    }

    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"))
      .sort();
    const seen = new Set<string>();
    const sources: AuthoritativeLegalSource[] = [];

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const parsed = AuthoritativeLegalSourceArraySchema.safeParse(raw);

      if (!parsed.success) {
        warnInDevelopment(`invalid legal source file skipped: ${file}`, parsed.error.message);
        continue;
      }

      for (const source of parsed.data) {
        if (seen.has(source.id)) {
          warnInDevelopment(`duplicate legal source id skipped: ${source.id}`);
          continue;
        }
        seen.add(source.id);
        sources.push(source);
      }
    }

    return sources;
  } catch (error) {
    warnInDevelopment("failed to load legal source JSON; using hardcoded fallback", error);
    return [];
  }
}

function warnInDevelopment(message: string, detail?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[legal-sources]", message, detail ?? "");
  }
}
