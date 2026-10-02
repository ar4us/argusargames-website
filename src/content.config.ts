import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const localizations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/localizations" }),
  schema: z.object({
    title: z.string(),
    game: z.string(),
    cover: z.string(),
    version: z.string(),
    status: z.enum(["complete", "partial", "beta"]),
    download_url: z.string().url(),
    file_size: z.string(),
    release_date: z.coerce.date(),
    description: z.string().optional(),
    screenshots: z.array(z.string()).optional(),
    install_guide: z.string().optional(),
    platforms: z.array(z.string()).default(["PC"]),
  }),
});

export const collections = { localizations };
