export interface OCRProcessingOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

export async function processReceiptImage(
  imageFile: File, 
  userId: number,
  options: OCRProcessingOptions = {}
) {
  try {
    options.onProgress?.(25);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('userId', userId.toString());

    options.onProgress?.(50);

    const response = await fetch('/api/receipt/upload', {
      method: 'POST',
      body: formData,
    });

    options.onProgress?.(75);

    if (!response.ok) {
      throw new Error('OCR processing failed');
    }

    const result = await response.json();
    options.onProgress?.(100);

    return result;
  } catch (error) {
    options.onError?.(error instanceof Error ? error.message : 'OCR processing failed');
    throw error;
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please select a valid image file (JPEG, PNG, or WebP)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image file size must be less than 10MB' };
  }

  return { valid: true };
}

export function getCameraConstraints() {
  return {
    video: {
      facingMode: 'environment', // Use back camera for receipt scanning
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    }
  };
}
