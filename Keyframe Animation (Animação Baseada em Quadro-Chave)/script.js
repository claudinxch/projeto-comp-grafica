// Referências ao canvas e contexto
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// Variáveis para animação
let startTime = 0; // Tempo de início da animação
let duration = 5; // Duração da animação em segundos
let currentTime = 0; // Tempo atual da animação
let animationFrameId; // ID do requestAnimationFrame

// Definindo os keyframes para a animação
const keyframes = [
  { time: 0, x: 50, y: 50, scale: 0.5, rotation: 0 },
  { time: 1, x: 200, y: 50, scale: 1.5, rotation: Math.PI / 4 },
  { time: 2, x: 350, y: 200, scale: 1, rotation: Math.PI / 2 },
  { time: 3, x: 200, y: 350, scale: 0.5, rotation: Math.PI },
  { time: 4, x: 50, y: 350, scale: 1, rotation: 3 * Math.PI / 2 },
  { time: 5, x: 50, y: 50, scale: 1, rotation: 2 * Math.PI },
];

// Função de interpolação linear entre dois valores
function interpolate(start, end, t) {
  return start + (end - start) * t;
}

// Função para calcular o estado da animação em um tempo específico
function getInterpolatedProperties(time) {
  // Encontre os keyframes anteriores e posteriores
  let startKeyframe = keyframes[0];
  let endKeyframe = keyframes[1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
      startKeyframe = keyframes[i];
      endKeyframe = keyframes[i + 1];
      break;
    }
  }

  // Interpolar entre os keyframes
  let t = (time - startKeyframe.time) / (endKeyframe.time - startKeyframe.time);
  let x = interpolate(startKeyframe.x, endKeyframe.x, t);
  let y = interpolate(startKeyframe.y, endKeyframe.y, t);
  let scale = interpolate(startKeyframe.scale, endKeyframe.scale, t);
  let rotation = interpolate(startKeyframe.rotation, endKeyframe.rotation, t);

  return { x, y, scale, rotation };
}

// Função para desenhar o objeto
function drawObject(x, y, scale, rotation) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

  ctx.save(); // Salva o estado do canvas

  // Transforma o canvas (translada, escala e rotaciona)
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);

  // Desenha um círculo (pode ser qualquer forma)
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();

  ctx.restore(); // Restaura o estado do canvas
}

// Função para atualizar a animação
function updateAnimation() {
  currentTime = (Date.now() - startTime) / 1000; // Tempo atual em segundos

  // Limita o tempo para que a animação não ultrapasse a duração
  if (currentTime > duration) {
    currentTime = duration;
  }

  // Obtém as propriedades interpoladas
  const { x, y, scale, rotation } = getInterpolatedProperties(currentTime);

  // Desenha o objeto com as propriedades interpoladas
  drawObject(x, y, scale, rotation);

  // Se a animação não terminou, continue a animação
  if (currentTime < duration) {
    animationFrameId = requestAnimationFrame(updateAnimation);
  }
}

// Função para iniciar a animação
function startAnimation() {
  startTime = Date.now();
  updateAnimation();
}
