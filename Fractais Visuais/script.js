const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mandelbrotBtn = document.getElementById("mandelbrotBtn");
const juliaBtn = document.getElementById("juliaBtn");
const zoomRange = document.getElementById("zoomRange");

let currentSet = "mandelbrot";
let zoomLevel = 1;
let maxIter = 500;

// Função para calcular o conjunto de Mandelbrot
function mandelbrot(x, y) {
    let zx = 0;
    let zy = 0;
    let iter = 0;
    while (zx * zx + zy * zy < 4 && iter < maxIter) {
        let tmp = zx * zx - zy * zy + x;
        zy = 2.0 * zx * zy + y;
        zx = tmp;
        iter++;
    }
    return iter;
}

// Função para calcular o conjunto de Julia
function julia(x, y, cx, cy) {
    let zx = x;
    let zy = y;
    let iter = 0;
    while (zx * zx + zy * zy < 4 && iter < maxIter) {
        let tmp = zx * zx - zy * zy + cx;
        zy = 2.0 * zx * zy + cy;
        zx = tmp;
        iter++;
    }
    return iter;
}

// Função para desenhar o conjunto Mandelbrot
function drawMandelbrot() {
    let width = canvas.width;
    let height = canvas.height;
    let imageData = ctx.createImageData(width, height);
    let zoom = zoomLevel;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let nx = (x - width / 2) / (0.5 * zoom * width);
            let ny = (y - height / 2) / (0.5 * zoom * height);

            let color = mandelbrot(nx, ny);
            let index = (y * width + x) * 4;
            imageData.data[index] = (color % 256); // Red
            imageData.data[index + 1] = (color % 256); // Green
            imageData.data[index + 2] = (color % 256); // Blue
            imageData.data[index + 3] = 255; // Alpha
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// Função para desenhar o conjunto Julia
function drawJulia(cx, cy) {
    let width = canvas.width;
    let height = canvas.height;
    let imageData = ctx.createImageData(width, height);
    let zoom = zoomLevel;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let nx = (x - width / 2) / (0.5 * zoom * width);
            let ny = (y - height / 2) / (0.5 * zoom * height);

            let color = julia(nx, ny, cx, cy);
            let index = (y * width + x) * 4;
            imageData.data[index] = (color % 256); // Red
            imageData.data[index + 1] = (color % 256); // Green
            imageData.data[index + 2] = (color % 256); // Blue
            imageData.data[index + 3] = 255; // Alpha
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// Função para ajustar a renderização conforme o conjunto selecionado
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentSet === "mandelbrot") {
        drawMandelbrot();
    } else if (currentSet === "julia") {
        drawJulia(-0.7, 0.27015); // Parametrização padrão para Julia
    }
}

// Interações com os botões
mandelbrotBtn.addEventListener("click", function() {
    currentSet = "mandelbrot";
    render();
});

juliaBtn.addEventListener("click", function() {
    currentSet = "julia";
    render();
});

// Controle de zoom
zoomRange.addEventListener("input", function() {
    zoomLevel = parseFloat(zoomRange.value);
    render();
});

// Inicializa com o conjunto Mandelbrot
render();
