export const processImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] * 1.2;
          data[i + 1] = data[i + 1] * 1.2;
          data[i + 2] = data[i + 2] * 1.2;
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        resolve({
          processedImageUrl: canvas.toDataURL(),
          width: img.width,
          height: img.height
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const generateHeatmap = (width, height, anomalies) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  
  anomalies.forEach(anomaly => {
    const gradient = ctx.createRadialGradient(
      anomaly.x, anomaly.y, 0,
      anomaly.x, anomaly.y, 50
    );
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });
  
  return canvas.toDataURL();
};

export const detectAnomalies = (imageWidth, imageHeight) => {
  const anomalies = [];
  const numAnomalies = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numAnomalies; i++) {
    anomalies.push({
      x: Math.random() * imageWidth,
      y: Math.random() * imageHeight,
      type: ['fracture', 'mass', 'inflammation'][Math.floor(Math.random() * 3)],
      confidence: Math.random() * 30 + 70
    });
  }
  
  return anomalies;
};