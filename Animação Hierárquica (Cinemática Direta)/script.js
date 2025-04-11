const canvas = document.getElementById('robotCanvas');
const ctx = canvas.getContext('2d');

// Variáveis para controlar os ângulos
let shoulderAngle = 0;
let elbowAngle = 0;

// Função para desenhar o robô com hierarquia de transformações
function drawRobot() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save(); // Salva o estado inicial

  // Posição do tronco
  ctx.translate(250, 250); // Começa no centro do canvas
  
  // Ombro (movimento hierárquico)
  ctx.save();
  ctx.rotate(shoulderAngle * Math.PI / 180); // Rotaciona o ombro
  ctx.fillStyle = 'blue';
  ctx.fillRect(-10, -10, 20, 20); // Desenha o ombro
  ctx.translate(0, 20); // Desloca para o início do braço
  
  // Braço (movimento hierárquico)
  ctx.save();
  ctx.fillStyle = 'green';
  ctx.fillRect(-5, 0, 60, 10); // Desenha o braço
  ctx.translate(60, 0); // Desloca para o cotovelo

  // Cotovelo (movimento hierárquico)
  ctx.save();
  ctx.rotate(elbowAngle * Math.PI / 180); // Rotaciona o cotovelo
  ctx.fillStyle = 'red';
  ctx.fillRect(-5, 0, 50, 10); // Desenha o antebraço
  ctx.translate(50, 0); // Desloca para a mão

  // Mão
  ctx.save();
  ctx.fillStyle = 'yellow';
  ctx.fillRect(-5, 0, 20, 10); // Desenha a mão
  ctx.restore(); // Restaura o estado da mão

  ctx.restore(); // Restaura o estado do cotovelo
  ctx.restore(); // Restaura o estado do braço
  ctx.restore(); // Restaura o estado do ombro
}

// Função para atualizar os ângulos com base nos controles
function updateAngles() {
  shoulderAngle = parseInt(document.getElementById('shoulderAngle').value);
  elbowAngle = parseInt(document.getElementById('elbowAngle').value);
  drawRobot();
}

// Atualiza os ângulos ao mover os controles
document.getElementById('shoulderAngle').addEventListener('input', updateAngles);
document.getElementById('elbowAngle').addEventListener('input', updateAngles);

// Desenha o robô inicialmente
updateAngles();
