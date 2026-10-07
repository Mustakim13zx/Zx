/**
 * IndexedDB Persistent Storage for Uploaded Video Clips
 * Ensures videos never get corrupted, revoked, or stop playing after upload or refresh.
 */

const DB_NAME = 'houz_video_db';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_videos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Memory cache of generated Blob URLs so we don't recreate them needlessly
const blobUrlCache = new Map<string, string>();

/**
 * Save a video File or Blob persistently in IndexedDB
 */
export async function saveVideoFile(id: string, file: Blob): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const record = { id, blob: file, type: file.type, createdAt: Date.now() };
    const request = store.put(record);

    request.onsuccess = () => {
      // Revoke old blob URL if any
      if (blobUrlCache.has(id)) {
        URL.revokeObjectURL(blobUrlCache.get(id)!);
      }
      const newUrl = URL.createObjectURL(file);
      blobUrlCache.set(id, newUrl);
      resolve(newUrl);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve a persistent video Blob URL by model id
 */
export async function getVideoUrl(id: string): Promise<string | null> {
  if (blobUrlCache.has(id)) {
    return blobUrlCache.get(id)!;
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result && request.result.blob) {
          const url = URL.createObjectURL(request.result.blob);
          blobUrlCache.set(id, url);
          resolve(url);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Delete a video from IndexedDB
 */
export async function deleteVideoFile(id: string): Promise<void> {
  if (blobUrlCache.has(id)) {
    URL.revokeObjectURL(blobUrlCache.get(id)!);
    blobUrlCache.delete(id);
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch {
    // Ignore error
  }
}

/**
 * Clear all uploaded videos from IndexedDB
 */
export async function clearAllVideoFiles(): Promise<void> {
  blobUrlCache.forEach((url) => URL.revokeObjectURL(url));
  blobUrlCache.clear();

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch {
    // Ignore error
  }
}
