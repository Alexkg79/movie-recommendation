import { openDB } from 'idb';

export const cacheImages = async (images: string[]) => {
  if (!('indexedDB' in window)) return;

  try {
    const db = await openDB('MovieGallery', 1, {
      upgrade(db) {
        db.createObjectStore('images');
      },
    });

    await Promise.all(
      images.map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        await db.put('images', blob, url);
      })
    );
  } catch (error) {
    console.error('Cache error:', error);
  }
};