// Reusable utility helpers for image compression and Google Sheet daily order count
window.HamperMediaUtils = {
  compressImageToBase64(file, maxDim = 1280, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64 = (dataUrl.split(',')[1]) || '';
        resolve({ base64, mimeType });
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };

      img.src = objectUrl;
    });
  },

  async fetchTodayOrderCount(sheetUrl) {
    const sep = sheetUrl.indexOf('?') === -1 ? '?' : '&';
    const url = `${sheetUrl}${sep}action=count&_t=${Date.now()}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    if (typeof json.count !== 'number') {
      throw new Error('Invalid count response from Google Sheet');
    }
    return json.count;
  }
};