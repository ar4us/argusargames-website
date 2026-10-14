const fs = require("fs");
const path = require("path");

const targetPath = path.join(
  process.cwd(),
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "build",
  "patches",
  "plugins",
  "load-manifest.js"
);

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, "utf-8");

  // 1. Add preview-props to manifest glob
  if (!content.includes("preview-props}")) {
    content = content.replace(
      "**/{*-manifest,required-server-files,prefetch-hints}.json",
      "**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json"
    );
  }

  // 2. Add preview-props to optional manifest list fallback
  if (!content.includes('p.endsWith("preview-props")')) {
    content = content.replace(
      'p.endsWith("prefetch-hints"))',
      'p.endsWith("prefetch-hints") || p.endsWith("preview-props"))'
    );
  }

  fs.writeFileSync(targetPath, content, "utf-8");
  console.log("Successfully patched @opennextjs/cloudflare for preview-props.json");
} else {
  console.warn("load-manifest.js not found to patch at", targetPath);
}
