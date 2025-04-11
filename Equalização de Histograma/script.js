const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('image-input');

input.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    const img = new Image();

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        equalizeHistogram();
    };
    img.src = URL.createObjectURL(file);
}

function equalizeHistogram() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calcular o histograma
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
        const brightness = Math.floor((data[i] + data[i+1] + data[i+2]) / 3);
        histogram[brightness]++;
    }

    // Cálculo da função de distribuição cumulativa (CDF)
    const cdf = histogram.slice();
    for (let i = 1; i < cdf.length; i++) {
        cdf[i] += cdf[i - 1];
    }

    // Normalizar o CDF
    const cdfMin = Math.min(...cdf);
    const cdfRange = cdf[cdf.length - 1] - cdfMin;

    for (let i = 0; i < data.length; i += 4) {
        const brightness = Math.floor((data[i] + data[i+1] + data[i+2]) / 3);
        const newValue = Math.floor((cdf[brightness] - cdfMin) / cdfRange * 255);
        data[i] = newValue;
        data[i + 1] = newValue;
        data[i + 2] = newValue;
    }

    ctx.putImageData(imageData, 0, 0);
}