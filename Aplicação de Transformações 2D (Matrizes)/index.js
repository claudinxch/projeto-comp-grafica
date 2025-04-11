const canvas = document.getElementById("transformCanvas");
const ctx = canvas.getContext("2d");

let shape = "rectangle";
let angle = 0, scale = 1, shearX = 0, shearY = 0;

// Define a forma
function setShape(selectedShape) {
    shape = selectedShape;
    applyTransformations();
}

// Aplica transformações
function applyTransformations() {
    angle = parseFloat(document.getElementById("rotation").value);
    scale = parseFloat(document.getElementById("scale").value);
    shearX = parseFloat(document.getElementById("shearX").value);
    shearY = parseFloat(document.getElementById("shearY").value);

    draw();
}

// Desenha a forma transformada
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((Math.PI / 180) * angle);

    let matrix = [
        [scale, shearX],
        [shearY, scale]
    ];

    ctx.transform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], 0, 0);

    ctx.beginPath();
    if (shape === "rectangle") {
        ctx.rect(-50, -30, 100, 60);
    } else if (shape === "triangle") {
        ctx.moveTo(-40, 40);
        ctx.lineTo(40, 40);
        ctx.lineTo(0, -40);
        ctx.closePath();
    } else if (shape === "circle") {
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    }
    
    ctx.stroke();
    ctx.restore();
}

// Inicializa o desenho
draw();
