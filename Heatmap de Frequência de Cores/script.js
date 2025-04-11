// Variáveis de DOM
const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("generateButton");
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

// Função para gerar o Heatmap baseado na frequência de cores
generateButton.addEventListener("click", () => {
    if (!imageData) {
        infoText.textContent = "Por favor, carregue uma imagem primeiro.";
        return;
    }

    infoText.textContent = "Gerando Heatmap...";

    const width = imageData.width;
    const height = imageData.height;

    // Inicializa o array de contagem de cores
    const colorCount = [];

    // Função para mapear a cor para o índice no array de contagem
    function colorToIndex(r, g, b) {
        return (r << 16) | (g << 8) | b;
    }

    // Contando a frequência de cada cor
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];

            const colorIndex = colorToIndex(r, g, b);
            if (colorCount[colorIndex]) {
                colorCount[colorIndex]++;
            } else {
                colorCount[colorIndex] = 1;
            }
        }
    }

    // Criando o heatmap com base nas contagens de cor
    const heatmap = new Uint8Array(width * height);
    let maxCount = Math.max(...Object.values(colorCount));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];

            const colorIndex = colorToIndex(r, g, b);
            const frequency = colorCount[colorIndex] || 0;
            heatmap[y * width + x] = Math.round((frequency / maxCount) * 255);
        }
    }

    // Exibindo o heatmap no canvas
    const heatmapImageData = ctx.createImageData(width, height);

    for (let i = 0; i < heatmap.length; i++) {
        const intensity = heatmap[i];
        const color = `rgb(${intensity}, ${255 - intensity}, 0)`; // De vermelho a verde

        heatmapImageData.data[i * 4] = parseInt(color.slice(4, 7)); // R
        heatmapImageData.data[i * 4 + 1] = parseInt(color.slice(9, 12)); // G
        heatmapImageData.data[i * 4 + 2] = 0; // B
        heatmapImageData.data[i * 4 + 3] = 255; // Alpha
    }

    // Desenhando o heatmap
    ctx.putImageData(heatmapImageData, 0, 0);

    infoText.textContent = "Heatmap gerado com sucesso!";
});
