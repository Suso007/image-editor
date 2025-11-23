interface Base64File {
  base64: string;
  mimeType: string;
}

export const fileToBase64 = (file: File): Promise<Base64File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64] = result.split(',');
      if (!header || !base64) {
        reject(new Error("Invalid file format"));
        return;
      }
      const mimeTypeMatch = header.match(/:(.*?);/);
      if (!mimeTypeMatch || !mimeTypeMatch[1]) {
        reject(new Error("Could not determine MIME type"));
        return;
      }
      const mimeType = mimeTypeMatch[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};
