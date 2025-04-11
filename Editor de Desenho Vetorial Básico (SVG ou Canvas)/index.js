const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
let shape = "line"; // Forma atual
let startX, startY, drawing = false;

// Define a forma selecionada
function setShape(selectedShape) {
    shape = selectedShape;
}

// Captura o ponto inicial do desenho
canvas.addEventListener("mousedown", (event) => {
    startX = event.offsetX;
    startY = event.offsetY;
    drawing = true;
});

// Finaliza o desenho e aplica a forma
canvas.addEventListener("mouseup", (event) => {
    if (!drawing) return;
    const endX = event.offsetX;
    const endY = event.offsetY;
    drawing = false;

    ctx.beginPath();
    if (shape === "line") {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    } else if (shape === "rectangle") {
        ctx.rect(startX, startY, endX - startX, endY - startY);
    } else if (shape === "circle") {
        let radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    }
    ctx.stroke();
});

// Aplica transformações (Translação, Rotação, Escala)
function applyTransformation(type) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (type === "translate") {
        ctx.translate(50, 50);
    } else if (type === "rotate") {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((Math.PI / 180) * 15);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
    } else if (type === "scale") {
        ctx.scale(1.2, 1.2);
    }
    ctx.restore();
}
