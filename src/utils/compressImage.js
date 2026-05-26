/**
 * Compresses an image File using Canvas.
 * - Scales down if wider/taller than maxPx
 * - Reduces JPEG quality iteratively until under targetMB
 * - Returns a new File with the same name
 */
export async function compressImage(file, targetMB = 1.5, maxPx = 1920) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Scale down dimensions if needed
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round((height * maxPx) / width);
          width = maxPx;
        } else {
          width = Math.round((width * maxPx) / height);
          height = maxPx;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      const maxBytes = targetMB * 1024 * 1024;
      let quality = 0.85;

      const attempt = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));

            if (blob.size <= maxBytes || quality <= 0.1) {
              resolve(
                new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            } else {
              quality = parseFloat((quality - 0.1).toFixed(2));
              attempt();
            }
          },
          "image/jpeg",
          quality
        );
      };

      attempt();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image"));
    };

    img.src = objectUrl;
  });
}
