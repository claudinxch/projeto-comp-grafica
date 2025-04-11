// Variáveis de DOM
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const marbleBtn = document.getElementById("marbleBtn");
const woodBtn = document.getElementById("woodBtn");
const cloudBtn = document.getElementById("cloudBtn");

// Função de ruído Perlin (usando uma versão simples de Perlin Noise)
function perlinNoise(x, y, seed = 0) {
    return Math.sin(x * Math.cos(y + seed));
}

// Função para gerar textura de mármore
function generateMarbleTexture() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const noise = perlinNoise(x * 0.05, y * 0.05, Math.random() * 100);
            const intensity = Math.floor((noise + 1) * 128); // Mapeando de -1 a 1 para 0 a 255

            const index = (y * width + x) * 4;
            imageData.data[index] = intensity;         // Red
            imageData.data[index + 1] = intensity;     // Green
            imageData.data[index + 2] = intensity;     // Blue
            imageData.data[index + 3] = 255;           // Alpha
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Função para gerar textura de madeira
function generateWoodTexture() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const noise = perlinNoise(x * 0.1, y * 0.1);
            const colorNoise = Math.floor((noise + 1) * 128);
            const intensity = Math.floor((Math.sin(x * 0.05) + Math.cos(y * 0.05)) * 128 + 127);

            const index = (y * width + x) * 4;
            imageData.data[index] = intensity + colorNoise; // Red
            imageData.data[index + 1] = intensity;         // Green
            imageData.data[index + 2] = colorNoise;       // Blue
            imageData.data[index + 3] = 255;               // Alpha
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Função para gerar textura de nuvens
function generateCloudTexture() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const noise = perlinNoise(x * 0.1, y * 0.1, Math.random() * 100);
            const intensity = Math.floor((noise + 1) * 128); // Mapeando de -1 a 1 para 0 a 255

            const index = (y * width + x) * 4;
            imageData.data[index] = 255 - intensity;       // Red (inverted for clouds)
            imageData.data[index + 1] = 255 - intensity;   // Green
            imageData.data[index + 2] = 255 - intensity;   // Blue
            imageData.data[index + 3] = 255;               // Alpha
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Ações dos botões
marbleBtn.addEventListener("click", generateMarbleTexture);
woodBtn.addEventListener("click", generateWoodTexture);
cloudBtn.addEventListener("click", generateCloudTexture);
