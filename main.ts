// Entry program for the make.fun bounty "Promote make.fun's
// make-your-own-bounty post on X" (post-x-promote-make-your-own-bounty-01).
//
// The entry itself is the X post: one post of our own quoting make.fun's
// post (https://x.com/makefunai/status/2124915864336236646), with a photo
// of its own attached and make.fun / @makefunai plus our play code in its
// text. This program's only job is to hand the post's address to the gate:
// it copies POST.json from the repository root to the output directory.
//
// Node 22, standard library only, no network.
//
// Local test:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POST.json");
const target = join(outDir, "POST.json");

if (!existsSync(source)) {
  console.error(`POST.json not found in ${botDir}`);
  process.exit(1);
}

const post = JSON.parse(readFileSync(source, "utf8")) as { url?: unknown };
if (typeof post.url !== "string" || !post.url.startsWith("https://x.com/")) {
  console.error("POST.json does not hold a valid X post address yet");
  process.exit(1);
}
// The starter placeholder is not a real post: refuse it loudly instead of
// handing the gate an address it will reject.
if (post.url.includes("<handle>") || post.url.includes("<id>")) {
  console.error("POST.json still holds the placeholder address — post on X first");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`POST.json copied: ${post.url}`);
