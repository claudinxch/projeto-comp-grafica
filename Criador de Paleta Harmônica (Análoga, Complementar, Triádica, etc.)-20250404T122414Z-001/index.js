// Função para converter a cor base (em hexadecimal) para HSL (matematicamente mais fácil para manipulação)
function hexToHsl(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / d + 2;
        } else {
            h = (r - g) / d + 4;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

// Função para gerar paleta análoga
function generateAnalogousPalette(h, s, l) {
    let colors = [];
    for (let i = -2; i <= 2; i++) {
        let hue = (h + i * 30) % 360; // ajuste do matiz
        colors.push(`hsl(${hue}, ${s}%, ${l}%)`);
    }
    return colors;
}

// Função para gerar paleta complementar
function generateComplementaryPalette(h, s, l) {
    let hue = (h + 180) % 360; // oposto no círculo cromático
    return [`hsl(${h}, ${s}%, ${l}%)`, `hsl(${hue}, ${s}%, ${l}%)`];
}

// Função para gerar paleta triádica
function generateTriadicPalette(h, s, l) {
    let colors = [];
    for (let i = 0; i < 3; i++) {
        let hue = (h + i * 120) % 360; // 120 graus de diferença
        colors.push(`hsl(${hue}, ${s}%, ${l}%)`);
    }
    return colors;
}

// Função para atualizar as paletas dinamicamente
function updatePalettes(baseColor) {
    let [h, s, l] = hexToHsl(baseColor);
    
    // Gera e exibe as paletas
    let analogousPalette = generateAnalogousPalette(h, s, l);
    let complementaryPalette = generateComplementaryPalette(h, s, l);
    let triadicPalette = generateTriadicPalette(h, s, l);

    // Atualizar as cores na interface
    document.querySelector("#analogous .colors").innerHTML = analogousPalette.map(color => `<div style="background-color: ${color};"></div>`).join('');
    document.querySelector("#complementary .colors").innerHTML = complementaryPalette.map(color => `<div style="background-color: ${color};"></div>`).join('');
    document.querySelector("#triadic .colors").innerHTML = triadicPalette.map(color => `<div style="background-color: ${color};"></div>`).join('');
}

// Evento do seletor de cor
document.getElementById("color-picker").addEventListener("input", (event) => {
    updatePalettes(event.target.value);
});

// Atualizar as paletas na inicialização
updatePalettes("#ff0000"); // Cor inicial
