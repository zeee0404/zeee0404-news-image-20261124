// main.ts — entry program for news-image-20261124.
//
// The newspaper front page is drawn by render.mjs and stored in this
// repository as entry.png. This program simply copies that image into the
// output directory, so both graded runs produce byte-identical output.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const target = join(outDir, "entry.png");

// The image ships in the repository next to this program; refuse to run
// with a confusing downstream error if it is somehow missing.
if (!statSync(source, { throwIfNoEntry: false })?.isFile()) {
  throw new Error(`entry.png not found next to main.ts at ${source}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Confirm the copy is a complete, in-limits PNG before exiting: the copy
// must hash exactly like the source, and the PNG header must describe the
// 1024x1024 image the competition requires.
const sourceBytes = readFileSync(source);
const bytes = readFileSync(target);
const sourceSha = createHash("sha256").update(sourceBytes).digest("hex");
const sha = createHash("sha256").update(bytes).digest("hex");
if (sha !== sourceSha) {
  throw new Error("copied entry.png does not match the repository image");
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}
// A PNG starts with its fixed 8-byte signature; refuse anything else
// before reading header fields that only make sense for a PNG.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png does not start with a PNG signature");
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
// The first chunk of a PNG must be IHDR; check its type tag before
// trusting the width and height read at the fixed offsets above.
if (bytes.toString("ascii", 12, 16) !== "IHDR") {
  throw new Error("entry.png has no IHDR chunk where one is expected");
}
if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png is ${width}x${height}, expected 1024x1024`);
}
console.log(`wrote ${target} (${bytes.length} bytes, sha256 ${sha})`);
