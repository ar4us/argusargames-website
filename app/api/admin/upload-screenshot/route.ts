import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const gameSlug = (formData.get("slug") as string | null) || "game";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure screenshots directory exists
    const uploadDir = path.join(process.cwd(), "public", "images", "screenshots");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const fileName = `${gameSlug}_${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/screenshots/${fileName}`;
    return NextResponse.json({
      ok: true,
      url: publicUrl,
      fileName: file.name,
    });
  } catch (err: any) {
    console.error("Upload screenshot error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save file" },
      { status: 500 }
    );
  }
}
