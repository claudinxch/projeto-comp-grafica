const imageInput = document.getElementById("imageInput");
const resolutionSlider = document.getElementById("resolution");
const resolutionValue = document.getElementById("resolutionValue");
const paletteSelector = document.getElementById("palette");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();

// Função para carregar a imagem
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Função para ajustar a resolução e renderizar a imagem
function createPixelArt() {
    const resolution = parseInt(resolutionSlider.value);
    resolutionValue.textContent = resolution;

    const palette = paletteSelector.value;
    const width = img.width;
    const height = img.height;

    canvas.width = width;
    canvas.height = height;

    // Desenha a imagem no canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Pega os dados da imagem
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;

    // Reduz a resolução
    for (let y = 0; y < height; y += resolution) {
        for (let x = 0; x < width; x += resolution) {
            let index = (y * width + x) * 4;
            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];

            // Aplicar a paleta de cores
            let color = getColor(r, g, b, palette);

            // Preenche o bloco de pixels com a cor
            for (let dy = 0; dy < resolution; dy++) {
                for (let dx = 0; dx < resolution; dx++) {
                    if (x + dx < width && y + dy < height) {
                        let idx = ((y + dy) * width + (x + dx)) * 4;
                        data[idx] = color[0]; // Red
                        data[idx + 1] = color[1]; // Green
                        data[idx + 2] = color[2]; // Blue
                        data[idx + 3] = 255; // Alpha
                    }
                }
            }
        }
    }

    // Coloca a imagem manipulada de volta no canvas
    ctx.putImageData(imageData, 0, 0);
}

// Função para obter a cor da paleta
function getColor(r, g, b, palette) {
    if (palette === "grayscale") {
        // Calcula o valor médio de cor para a escala de cinza
        let gray = Math.round((r + g + b) / 3);
        return [gray, gray, gray];
    } else if (palette === "random") {
        // Paleta aleatória
        return [r, g, b];
    }
}

// Atualiza a imagem quando a resolução ou a paleta mudar
resolutionSlider.addEventListener("input", createPixelArt);
paletteSelector.addEventListener("change", createPixelArt);

// Cria a arte inicial assim que a imagem for carregada
img.onload = createPixelArt;
