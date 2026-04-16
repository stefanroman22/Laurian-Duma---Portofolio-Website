#!/usr/bin/env node
/**
 * scripts/sync-cms-types.mjs
 *
 * Downloads the TypeScript type declarations for this project's CMS content
 * from the CMS `/content/{slug}/types` endpoint and writes them to src/lib/cms.types.ts.
 *
 * Usage:
 *   npm run cms:sync-types
 */

import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const require = createRequire(import.meta.url);
const config = require(join(ROOT, "cms.config.json"));

const projectSlug = config.projectSlug;
const endpoint = config.endpoint ?? "https://cms.romantechnologies.com/content";

if (!projectSlug) {
  console.error("❌  projectSlug not found in cms.config.json");
  process.exit(1);
}

const typesUrl = `${endpoint}/${projectSlug}/types`;
console.log(`⬇  Fetching types from ${typesUrl} …`);

let body;
try {
  const res = await fetch(typesUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  body = await res.text();
} catch (err) {
  console.error(`❌  Fetch failed: ${err.message}`);
  process.exit(1);
}

const outPath = join(ROOT, "src", "lib", "cms.types.ts");
await writeFile(outPath, body, "utf-8");

console.log(`✅  Types written to src/lib/cms.types.ts`);
console.log(`    Import with: import type { CMSContent } from './cms.types'`);
