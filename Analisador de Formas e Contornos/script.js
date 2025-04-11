// Variáveis de DOM
const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const detectButton = document.getElementById("detectButton");
const infoText = document.getElementById("info");

let img = new Image();
let imageData;
let detectedBoxes = [];

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

// Função para detectar formas e desenhar bounding boxes
detectButton.addEventListener("click", () => {
    if (!imageData) {
        infoText.textContent = "Por favor, carregue uma imagem primeiro.";
        return;
    }

    infoText.textContent = "Detectando formas...";

    detectedBoxes = [];
    const width = imageData.width;
    const height = imageData.height;
    const visited = new Array(width * height).fill(false);

    // Função para flood fill (preenchimento por flood)
    function floodFill(x, y, color) {
        const stack = [[x, y]];
        const pixels = [];
        const targetColor = getPixelColor(x, y);

        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
            const index = (cy * width + cx) * 4;

            if (visited[cy * width + cx]) continue;

            if (Math.abs(imageData.data[index] - targetColor.r) < 50 &&
                Math.abs(imageData.data[index + 1] - targetColor.g) < 50 &&
                Math.abs(imageData.data[index + 2] - targetColor.b) < 50) {
                visited[cy * width + cx] = true;
                pixels.push([cx, cy]);

                // Adiciona os vizinhos
                stack.push([cx + 1, cy]);
                stack.push([cx - 1, cy]);
                stack.push([cx, cy + 1]);
                stack.push([cx, cy - 1]);
            }
        }

        return pixels;
    }

    // Função para obter a cor do pixel
    function getPixelColor(x, y) {
        const index = (y * width + x) * 4;
        return { r: imageData.data[index], g: imageData.data[index + 1], b: imageData.data[index + 2] };
    }

    // Iterar sobre todos os pixels da imagem
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!visited[y * width + x]) {
                const regionPixels = floodFill(x, y, getPixelColor(x, y));

                if (regionPixels.length > 0) {
                    const minX = Math.min(...regionPixels.map(p => p[0]));
                    const maxX = Math.max(...regionPixels.map(p => p[0]));
                    const minY = Math.min(...regionPixels.map(p => p[1]));
                    const maxY = Math.max(...regionPixels.map(p => p[1]));

                    detectedBoxes.push({ minX, minY, maxX, maxY, area: regionPixels.length });
                }
            }
        }
    }

    // Desenhando as bounding boxes detectadas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    detectedBoxes.forEach(box => {
        ctx.beginPath();
        ctx.rect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY);

        // Exibindo área e perímetro
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Área: ${box.area}`, box.minX + 5, box.minY + 20);
    });

    infoText.textContent = `Detectado ${detectedBoxes.length} formas com sucesso!`;
});
