// app/actions/admin/uploadReportIcon.ts
"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import db from "@/db";

export async function uploadReportIcon(
  reportTypeId: number,
  formData: FormData
) {
  try {
    const file = formData.get("icon") as File;

    if (!file) {
      return {
        success: false,
        message: "No file uploaded",
      };
    }

    // Check file type
    if (!file.type.startsWith("image/png")) {
      return {
        success: false,
        message: "Only PNG files are allowed",
      };
    }

    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Check image dimensions and size
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (
      (metadata.width && metadata.width > 80) ||
      (metadata.height && metadata.height > 80)
    ) {
      // Resize image to maximum 80x80
      const resizedBuffer = await sharp(buffer)
        .resize(80, 80, { fit: "inside" })
        .toBuffer();

      // Replace original buffer with resized one
      const resizedImage = new File([resizedBuffer], file.name, {
        type: file.type,
      });

      // Continue with resized image
      const bytes = await resizedImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
    }

    // Check file size (after potential resize)
    const maxSize = 50 * 1024; // 50KB
    if (buffer.length > maxSize) {
      return {
        success: false,
        message: "File size must be less than 50KB",
      };
    }

    // Generate unique filename
    const uniqueFilename = `${uuidv4()}.png`;

    // Define path for saving the file (in public/uploads/icons)
    const publicDir = join(process.cwd(), "public");
    const uploadsDir = join(publicDir, "uploads", "icons");
    const filePath = join(uploadsDir, uniqueFilename);

    // Ensure directory exists
    await mkdir(join(publicDir, "uploads", "icons"), { recursive: true });

    // Write file to disk
    await writeFile(filePath, buffer);

    // Update database with icon URL
    const iconUrl = `/uploads/icons/${uniqueFilename}`;
    await db.reportType.update({
      where: { id: reportTypeId },
      data: { iconUrl },
    });

    return {
      success: true,
      iconUrl,
    };
  } catch (error: any) {
    console.error("Error uploading icon:", error);
    return {
      success: false,
      message: error.message || "Failed to upload icon",
    };
  }
}
