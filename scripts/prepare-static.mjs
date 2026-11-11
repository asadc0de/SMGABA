import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const outputDirectory = path.resolve("static-dist");
const generatedHtml = path.join(outputDirectory, "static.index.html");
const indexHtml = path.join(outputDirectory, "index.html");
const htaccessSource = path.resolve("public", ".htaccess");
const htaccessDestination = path.join(outputDirectory, ".htaccess");

if (!existsSync(generatedHtml)) {
  throw new Error(`Static build entry was not found: ${generatedHtml}`);
}

mkdirSync(outputDirectory, { recursive: true });
copyFileSync(generatedHtml, indexHtml);
rmSync(generatedHtml);

if (existsSync(htaccessSource)) {
  copyFileSync(htaccessSource, htaccessDestination);
}
