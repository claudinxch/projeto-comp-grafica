// Configuração inicial do canvas
const canvas = document.getElementById('physicsCanvas');
const ctx = canvas.getContext('2d');

// Constantes para a simulação
const gravity = 0.5; // aceleração devido à gravidade
const friction = 0.99; // fator de atrito para a colisão (reduz a velocidade)
const radius = 15; // raio das bolinhas

// Lista de bolinhas
let balls = [];

// Função para gerar bolinhas em posições aleatórias
function createBall() {
  let ball = {
    x: Math.random() * (canvas.width - radius * 2) + radius, // posição inicial aleatória
    y: Math.random() * (canvas.height - radius * 2) + radius, 
    vx: Math.random() * 4 - 2, // velocidade aleatória no eixo X
    vy: Math.random() * 4 - 2, // velocidade aleatória no eixo Y
    color: `hsl(${Math.random() * 360}, 100%, 50%)`, // cor aleatória
  };
  balls.push(ball);
}

// Função para desenhar as bolinhas
function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Função de detecção de colisão com as paredes
function handleWallCollisions(ball) {
  // Colisão com a parede inferior
  if (ball.y + radius > canvas.height) {
    ball.y = canvas.height - radius; // evita ultrapassar a parede
    ball.vy = -ball.vy * friction; // inverte a velocidade e aplica o atrito
  }
  
  // Colisão com a parede superior
  if (ball.y - radius < 0) {
    ball.y = radius;
    ball.vy = -ball.vy * friction;
  }
  
  // Colisão com a parede direita
  if (ball.x + radius > canvas.width) {
    ball.x = canvas.width - radius;
    ball.vx = -ball.vx * friction;
  }
  
  // Colisão com a parede esquerda
  if (ball.x - radius < 0) {
    ball.x = radius;
    ball.vx = -ball.vx * friction;
  }
}

// Função de atualização dos movimentos
function updatePhysics(deltaTime) {
  balls.forEach(ball => {
    // Atualiza a velocidade com a gravidade
    ball.vy += gravity * deltaTime;
    
    // Atualiza as posições com base na velocidade
    ball.x += ball.vx * deltaTime;
    ball.y += ball.vy * deltaTime;
    
    // Verifica colisões com as paredes
    handleWallCollisions(ball);
  });
}

// Função para desenhar o cenário
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
  
  // Desenha todas as bolinhas
  balls.forEach(drawBall);
}

// Função de animação que roda continuamente
let lastTime = 0;
function animate(time) {
  // Calcula o tempo delta (diferença entre o tempo atual e o tempo do último quadro)
  let deltaTime = (time - lastTime) / 1000; // deltaTime em segundos
  lastTime = time;
  
  // Atualiza a física (movimento e colisões)
  updatePhysics(deltaTime);
  
  // Desenha a cena
  draw();
  
  // Solicita o próximo quadro
  requestAnimationFrame(animate);
}

// Inicia a animação
createBall(); // Cria uma bolinha
animate(0); // Inicia a animação

// Criação de novas bolinhas quando clicado no canvas
canvas.addEventListener('click', () => {
  createBall();
});
