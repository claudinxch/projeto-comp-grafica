// script.js

document.getElementById('color-picker').addEventListener('input', handleColorChange);
document.getElementById('image-upload').addEventListener('change', handleImageUpload);
document.getElementById('dalt-type').addEventListener('change', simulateColorBlindness);

function handleColorChange(event) {
    const color = event.target.value;
    simulateColorBlindness(color);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                simulateColorBlindness(image);
            };
        };
        reader.readAsDataURL(file);
    }
}

function simulateColorBlindness(input) {
    const type = document.getElementById('dalt-type').value;
    const outputContainer = document.getElementById('simulated-image');
    outputContainer.innerHTML = '';

    if (typeof input === 'string') { // Color selected
        outputContainer.style.backgroundColor = simulateColor(input, type);
    } else { // Image selected
        const img = document.createElement('img');
        img.src = simulateImage(input, type);
        img.style.width = '100%';
        img.style.height = 'auto';
        outputContainer.appendChild(img);
    }
}

function simulateColor(color, type) {
    // Função para simular a cor alterada para o tipo de daltonismo
    switch (type) {
        case 'protanopia':
            return protanopiaFilter(color);
        case 'deuteranopia':
            return deuteranopiaFilter(color);
        case 'tritanopia':
            return tritanopiaFilter(color);
        default:
            return color;
    }
}

function simulateImage(image, type) {
    // Função para simular a imagem alterada para o tipo de daltonismo
    // (Aqui, seria ideal usar uma biblioteca de filtros, como color-blind ou algo similar)
    return image.src; // Simplesmente retorna a imagem sem simulação por enquanto
}

// Funções de filtros de daltonismo
function protanopiaFilter(color) {
    // Código para simular protanopia (filtro de cor)
    return color; // Substitua isso por código de filtro real
}

function deuteranopiaFilter(color) {
    // Código para simular deuteranopia
    return color; // Substitua isso por código de filtro real
}

function tritanopiaFilter(color) {
    // Código para simular tritanopia
    return color; // Substitua isso por código de filtro real
}
