const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// Variáveis para animação
let startTime = 0;
let duration = 5; // Duração em segundos
let currentTime = 0;
let animationFrameId;

// Função de interpolação linear
function interpolate(start, end, t) {
  return start + (end - start) * t;
}

// Função para desenhar um círculo
function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();
}

// Função para calcular a posição ao longo de uma curva Bézier
function bezier(t, p0, p1, p2) {
  let x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  let y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
}

// Função para animar o objeto ao longo de uma curva Bézier
function animateBezier() {
  currentTime = (Date.now() - startTime) / 1000;
  if (currentTime > duration) currentTime = duration;

  const p0 = { x: 50, y: 450 }; // ponto inicial
  const p1 = { x: 250, y: 50 };  // ponto de controle
  const p2 = { x: 450, y: 450 }; // ponto final

  // Interpolar a posição ao longo da curva
  let t = currentTime / duration; // t varia de 0 a 1
  let position = bezier(t, p0, p1, p2);

  // Limpa o canvas e desenha o objeto
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle(position.x, position.y, 10);

  if (currentTime < duration) {
    animationFrameId = requestAnimationFrame(animateBezier);
  }
}

// Função para animar o objeto em um caminho circular
function animateCircle() {
  currentTime = (Date.now() - startTime) / 1000;
  if (currentTime > duration) currentTime = duration;

  const centerX = 250;
  const centerY = 250;
  const radius = 150;

  // A posição no caminho circular é baseada em um ângulo que depende de t
  let angle = 2 * Math.PI * (currentTime / duration);

  let x = centerX + radius * Math.cos(angle);
  let y = centerY + radius * Math.sin(angle);

  // Limpa o canvas e desenha o objeto
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle(x, y, 10);

  if (currentTime < duration) {
    animationFrameId = requestAnimationFrame(animateCircle);
  }
}

// Função para iniciar a animação Bézier
function startBezierAnimation() {
  startTime = Date.now();
  animateBezier();
}

// Função para iniciar a animação Circular
function startCircleAnimation() {
  startTime = Date.now();
  animateCircle();
}
