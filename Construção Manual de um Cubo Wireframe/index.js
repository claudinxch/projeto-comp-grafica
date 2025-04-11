const canvas = document.getElementById("cubeCanvas");
const ctx = canvas.getContext("2d");

const vertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
];

const edges = [
    [0,1], [1,2], [2,3], [3,0],
    [4,5], [5,6], [6,7], [7,4],
    [0,4], [1,5], [2,6], [3,7]
];

let angleX = 0, angleY = 0;

// Multiplicação de matriz para rotação
function rotateX(point, angle) {
    let [x, y, z] = point;
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return [x, cos * y - sin * z, sin * y + cos * z];
}

function rotateY(point, angle) {
    let [x, y, z] = point;
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return [cos * x + sin * z, y, -sin * x + cos * z];
}

// Projeção perspectiva simples
function project(point) {
    let [x, y, z] = point;
    let distance = 4;
    let scale = distance / (distance - z);
    return [x * scale * 100 + canvas.width / 2, -y * scale * 100 + canvas.height / 2];
}

// Desenha o cubo wireframe
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let transformed = vertices.map(v => rotateX(rotateY(v, angleY), angleX));
    let projected = transformed.map(v => project(v));

    ctx.strokeStyle = "white";
    ctx.beginPath();
    edges.forEach(([start, end]) => {
        let [x1, y1] = projected[start];
        let [x2, y2] = projected[end];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    });
    ctx.stroke();
}

// Animação do cubo
function animate() {
    angleX += 0.02;
    angleY += 0.03;
    draw();
    requestAnimationFrame(animate);
}

animate();
