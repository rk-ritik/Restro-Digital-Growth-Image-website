import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { addDownloadRecord, incrementDownloadCount } from './storage';

/**
 * Trigger high-res image download directly to the user's computer.
 * Preserves the file format and names it by dish name.
 * Dispatches celebratory confetti and updates localStorage history.
 */
export async function downloadFoodImage(food, format = 'original') {
  if (!food) return { success: false, error: 'No image specified' };

  try {
    const rawName = food.name || 'food-image';
    const cleanName = rawName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const fileExt = food.filename?.split('.').pop() || 'jpg';
    const targetFilename = `${cleanName}.${fileExt}`;
    const imageUrl = food.image;

    // Fetch the image as a Blob to enforce physical file download
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    saveAs(blob, targetFilename);

    // Save download to browser local history
    addDownloadRecord(food);
    incrementDownloadCount();

    // Trigger subtle confetti burst
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ff713f', '#10b981', '#f59e0b', '#3b82f6'],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fallback silent
    }

    return {
      success: true,
      filename: targetFilename,
      message: `Downloaded ${food.name} (${targetFilename})`,
    };
  } catch (error) {
    console.error('Download error:', error);
    // Fallback: standard link download
    try {
      const link = document.createElement('a');
      link.href = food.image;
      link.download = food.filename || `${food.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addDownloadRecord(food);
      incrementDownloadCount();

      return {
        success: true,
        filename: food.filename || `${food.name}.jpg`,
        message: `Downloaded ${food.name}`,
      };
    } catch (fallbackErr) {
      return {
        success: false,
        error: fallbackErr.message || 'Download failed',
      };
    }
  }
}
