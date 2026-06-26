import { v2 as cloudinary } from "cloudinary";
import { CustomError } from "../errors/customError.error";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}

export async function uploadFile(
  buffer: Buffer,
  folder: string,
  fileName: string
): Promise<UploadResult> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new CustomError("Cloudinary is not configured", 500);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `sistema-pericial/${folder}`,
        public_id: fileName.replace(/\.[^/.]+$/, ""),
        resource_type: "auto",
      },
      (error, result) => {
        if (error || !result) {
          reject(
            new CustomError(error?.message || "Upload failed", 500)
          );
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteFile(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return;

  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
