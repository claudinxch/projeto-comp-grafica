const canvas = document.getElementById('morphCanvas');
const ctx = canvas.getContext('2d');

// Função para desenhar um quadrado
function drawSquare(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y - size / 2); // topo esquerdo
  ctx.lineTo(x + size / 2, y - size / 2); // topo direito
  ctx.lineTo(x + size / 2, y + size / 2); // inferior direito
  ctx.lineTo(x - size / 2, y + size / 2); // inferior esquerdo
  ctx.closePath();
  ctx.fill();
}

// Função para desenhar um círculo
function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

// Função para interpolar entre duas formas
function interpolateShapes(start, end, t) {
  // Inicia um novo caminho
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

  // Número de pontos (vértices) para o morfing
  const points = 8;
  const radius = 100; // Tamanho do círculo
  const size = 200; // Tamanho do quadrado

  ctx.fillStyle = 'blue';

  // Desenha as formas interpoladas
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    let angle = (i / points) * 2 * Math.PI;
    
    // Interpolação de posição de cada vértice
    let startX = start.x + Math.cos(angle) * (start.radius || size);
    let startY = start.y + Math.sin(angle) * (start.radius || size);
    
    let endX = end.x + Math.cos(angle) * (end.radius || radius);
    let endY = end.y + Math.sin(angle) * (end.radius || radius);

    // Interpolação linear
    let x = startX + (endX - startX) * t;
    let y = startY + (endY - startY) * t;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
}

// Função para animar a interpolação
let t = 0; // fator de interpolação (0 -> quadrado, 1 -> círculo)
function animateMorphing() {
  t += 0.01; // Incrementa o fator de interpolação
  if (t > 1) t = 0; // Se ultrapassar 1, reinicia a animação
  
  // Define as formas inicial e final (quadrado e círculo)
  const start = { x: canvas.width / 2, y: canvas.height / 2, radius: 0 }; // Quadrado
  const end = { x: canvas.width / 2, y: canvas.height / 2, radius: 100 }; // Círculo
  
  // Interpolação entre as duas formas
  interpolateShapes(start, end, t);

  // Solicita o próximo quadro
  requestAnimationFrame(animateMorphing);
}

// Inicia a animação
animateMorphing();
