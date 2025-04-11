// Variáveis de DOM
const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const thresholdButton = document.getElementById("thresholdButton");
const kmeansButton = document.getElementById("kmeansButton");
const infoText = document.getElementById("info");

let img = new Image();
let imageData;

// Função para carregar a imagem selecionada
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Função de Thresholding (Segmentação por limiar)
thresholdButton.addEventListener("click", () => {
    if (!imageData) {
        infoText.textContent = "Por favor, carregue uma imagem primeiro.";
        return;
    }
    infoText.textContent = "Aplicando Thresholding...";

    const threshold = 128; // Limiar fixo para segmentação
    const newImageData = new ImageData(imageData.width, imageData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const brightness = (r + g + b) / 3;

        const color = brightness > threshold ? 255 : 0; // 0 ou 255 (preto ou branco)

        newImageData.data[i] = newImageData.data[i + 1] = newImageData.data[i + 2] = color;
        newImageData.data[i + 3] = 255; // Opacidade total
    }

    ctx.putImageData(newImageData, 0, 0);
    infoText.textContent = "Thresholding aplicado com sucesso!";
});

// Função para K-means (Segmentação por K-means)
kmeansButton.addEventListener("click", () => {
    if (!imageData) {
        infoText.textContent = "Por favor, carregue uma imagem primeiro.";
        return;
    }
    infoText.textContent = "Aplicando K-means...";

    const k = 2; // número de clusters
    const maxIterations = 10;
    const clusters = [[], []];
    let centroids = [
        [Math.random() * 255, Math.random() * 255, Math.random() * 255], 
        [Math.random() * 255, Math.random() * 255, Math.random() * 255]
    ];

    // Algoritmo básico de K-means
    for (let iter = 0; iter < maxIterations; iter++) {
        clusters[0] = [];
        clusters[1] = [];

        // Atribuindo pixels aos clusters
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];

            const distanceToCentroid0 = Math.sqrt(
                Math.pow(r - centroids[0][0], 2) + Math.pow(g - centroids[0][1], 2) + Math.pow(b - centroids[0][2], 2)
            );
            const distanceToCentroid1 = Math.sqrt(
                Math.pow(r - centroids[1][0], 2) + Math.pow(g - centroids[1][1], 2) + Math.pow(b - centroids[1][2], 2)
            );

            const cluster = distanceToCentroid0 < distanceToCentroid1 ? 0 : 1;
            clusters[cluster].push([r, g, b, i]);
        }

        // Atualizando centroides
        for (let i = 0; i < k; i++) {
            const cluster = clusters[i];
            if (cluster.length > 0) {
                const avgR = cluster.reduce((sum, p) => sum + p[0], 0) / cluster.length;
                const avgG = cluster.reduce((sum, p) => sum + p[1], 0) / cluster.length;
                const avgB = cluster.reduce((sum, p) => sum + p[2], 0) / cluster.length;
                centroids[i] = [avgR, avgG, avgB];
            }
        }
    }

    // Aplicando o resultado da segmentação
    const newImageData = new ImageData(imageData.width, imageData.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const distanceToCentroid0 = Math.sqrt(
            Math.pow(r - centroids[0][0], 2) + Math.pow(g - centroids[0][1], 2) + Math.pow(b - centroids[0][2], 2)
        );
        const distanceToCentroid1 = Math.sqrt(
            Math.pow(r - centroids[1][0], 2) + Math.pow(g - centroids[1][1], 2) + Math.pow(b - centroids[1][2], 2)
        );

        const cluster = distanceToCentroid0 < distanceToCentroid1 ? 0 : 1;
        newImageData.data[i] = centroids[cluster][0];
        newImageData.data[i + 1] = centroids[cluster][1];
        newImageData.data[i + 2] = centroids[cluster][2];
        newImageData.data[i + 3] = 255; // Opacidade total
    }

    ctx.putImageData(newImageData, 0, 0);
    infoText.textContent = "K-means aplicado com sucesso!";
});
