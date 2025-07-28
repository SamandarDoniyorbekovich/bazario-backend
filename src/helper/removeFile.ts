import fs from "fs";
import path from "path";

export const removeFile = async (fileId?: string) => {
  try {
    if (!fileId) return;

    const filePath = path.join(__dirname, "../public/files", fileId);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log("File deleted:", fileId);
    } else {
      console.log("File not found:", fileId);
    }
  } catch (error) {
    console.error("Error with file deleting:", error);
  }
};

export const removeFiles = async (fileIds?: string[]) => {
  try {
    if (!fileIds) return;

    // Handle array of files
    for (const file of fileIds) {
      await removeFile(file);
    }
  } catch (error) {
    console.error("Error with file deleting:", error);
  }
};

export const filterImages = async (oldImages: string[], images: string | string[], fileImages: any) => {

  let oldimagePath = [];
  if (Array.isArray(images)) {
    oldimagePath = images
  } else if (typeof images === "string") {
    oldimagePath.push(images)
  }

  oldImages.forEach(async (image: string) => {
    if (!oldimagePath.includes(image)) {
      await removeFile(image);
    }
  });

  let uploadedFiles = Array.isArray(fileImages) ? fileImages.map((file: any) => file.filename) : []

  const newImages = [...oldImages, ...uploadedFiles]

  return newImages
}