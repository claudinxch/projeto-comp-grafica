const canvas = document.getElementById("bresenhamCanvas");
const ctx = canvas.getContext("2d");
const pointsLog = document.getElementById("pointsLog");

let startX = null, startY = null;

// Evento de clique para capturar pontos
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);

    if (startX === null) {
        startX = x;
        startY = y;
    } else {
        drawBresenhamLine(startX, startY, x, y);
        startX = null;
        startY = null;
    }
});

// Implementação do Algoritmo de Bresenham
function drawBresenhamLine(x0, y0, x1, y1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    pointsLog.innerHTML = "<strong>Pontos calculados:</strong><br>";

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        ctx.fillRect(x0, y0, 2, 2); // Desenha um pixel (quadrado 2x2)
        pointsLog.innerHTML += `(${x0}, ${y0})<br>`;

        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}
