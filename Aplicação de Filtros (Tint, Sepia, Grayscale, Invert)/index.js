const uploadInput = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tintButton = document.getElementById('tint');
const sepiaButton = document.getElementById('sepia');
const grayscaleButton = document.getElementById('grayscale');
const invertButton = document.getElementById('invert');

// Função para carregar a imagem no canvas
uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = URL.createObjectURL(file);
    }
});

// Funções para aplicar os filtros
function applyFilter(filter) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (filter === 'tint') {
            // Adiciona um tom de vermelho
            data[i] = r + 100; 
            data[i + 1] = g - 50; 
            data[i + 2] = b - 50;
        } else if (filter === 'sepia') {
            // Aplica o filtro sepia
            data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
            data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
        } else if (filter === 'grayscale') {
            // Converte para grayscale
            const avg = (r + g + b) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        } else if (filter === 'invert') {
            // Inverte as cores
            data[i] = 255 - r;
            data[i + 1] = 255 - g;
            data[i + 2] = 255 - b;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Adicionando eventos aos botões
tintButton.addEventListener('click', () => applyFilter('tint'));
sepiaButton.addEventListener('click', () => applyFilter('sepia'));
grayscaleButton.addEventListener('click', () => applyFilter('grayscale'));
invertButton.addEventListener('click', () => applyFilter('invert'));
