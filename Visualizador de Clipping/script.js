const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Definir os limites da janela de recorte
let clipLeft = 100, clipTop = 50, clipRight = 500, clipBottom = 350;

// Função para desenhar a janela de recorte
function drawClippingWindow() {
    ctx.beginPath();
    ctx.rect(clipLeft, clipTop, clipRight - clipLeft, clipBottom - clipTop);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';
    ctx.stroke();
    ctx.closePath();
}

// Algoritmo Cohen-Sutherland para recorte de linhas
function cohenSutherlandClip(x0, y0, x1, y1) {
    const INSIDE = 0; // Código de região: dentro da janela
    const LEFT = 1; // Código de região: esquerda
    const RIGHT = 2; // Código de região: direita
    const BOTTOM = 4; // Código de região: embaixo
    const TOP = 8; // Código de região: em cima
    
    let code0 = computeCode(x0, y0);
    let code1 = computeCode(x1, y1);
    let accept = false;

    while (true) {
        if ((code0 === 0) && (code1 === 0)) {
            accept = true;
            break;
        } else if ((code0 & code1) !== 0) {
            break;
        } else {
            let x, y;
            let codeOut = code0 !== 0 ? code0 : code1;

            if (codeOut & TOP) {
                x = x0 + (x1 - x0) * (clipTop - y0) / (y1 - y0);
                y = clipTop;
            } else if (codeOut & BOTTOM) {
                x = x0 + (x1 - x0) * (clipBottom - y0) / (y1 - y0);
                y = clipBottom;
            } else if (codeOut & RIGHT) {
                y = y0 + (y1 - y0) * (clipRight - x0) / (x1 - x0);
                x = clipRight;
            } else if (codeOut & LEFT) {
                y = y0 + (y1 - y0) * (clipLeft - x0) / (x1 - x0);
                x = clipLeft;
            }

            if (codeOut === code0) {
                x0 = x;
                y0 = y;
                code0 = computeCode(x0, y0);
            } else {
                x1 = x;
                y1 = y;
                code1 = computeCode(x1, y1);
            }
        }
    }

    if (accept) {
        drawLine(x0, y0, x1, y1);
    }
}

// Função para calcular o código da região de uma linha
function computeCode(x, y) {
    let code = 0;

    if (x < clipLeft) code |= 1; // Esquerda
    if (x > clipRight) code |= 2; // Direita
    if (y < clipTop) code |= 4; // Embaixo
    if (y > clipBottom) code |= 8; // Em cima

    return code;
}

// Função para desenhar a linha
function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

// Adiciona evento de clique para desenhar linhas
canvas.addEventListener('click', (e) => {
    const x0 = Math.random() * canvas.width;
    const y0 = Math.random() * canvas.height;
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    
    cohenSutherlandClip(x0, y0, x1, y1);
});

// Atualiza os limites do recorte a partir dos inputs
document.getElementById('clipLeft').addEventListener('input', (e) => {
    clipLeft = parseInt(e.target.value);
    redraw();
});

document.getElementById('clipTop').addEventListener('input', (e) => {
    clipTop = parseInt(e.target.value);
    redraw();
});

document.getElementById('clipRight').addEventListener('input', (e) => {
    clipRight = parseInt(e.target.value);
    redraw();
});

document.getElementById('clipBottom').addEventListener('input', (e) => {
    clipBottom = parseInt(e.target.value);
    redraw();
});

// Função para redesenhar o canvas
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClippingWindow();
}

// Função para limpar o canvas
document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClippingWindow();
});

// Desenhar a janela de clipping inicial
drawClippingWindow();
