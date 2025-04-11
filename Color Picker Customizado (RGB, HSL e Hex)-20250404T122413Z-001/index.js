// Função para converter valores RGB para Hexadecimal
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

// Função para converter valores RGB para HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return "hsl(" + Math.round(h * 360) + ", " + Math.round(s * 100) + "%, " + Math.round(l * 100) + "%)";
}

// Função para atualizar os valores exibidos
function updateColorInfo() {
    let color = document.getElementById("color-picker").value;

    // Convertendo a cor para RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Atualizando a exibição do box de cor
    document.getElementById("color-box").style.backgroundColor = color;

    // Atualizando os valores de RGB, HSL e Hex
    document.getElementById("rgb-value").textContent = `rgb(${r}, ${g}, ${b})`;
    document.getElementById("hsl-value").textContent = rgbToHsl(r, g, b);
    document.getElementById("hex-value").textContent = color.toUpperCase();
}

// Evento de mudança da cor no seletor
document.getElementById("color-picker").addEventListener("input", updateColorInfo);

// Inicializa com a cor padrão (preto)
updateColorInfo();
