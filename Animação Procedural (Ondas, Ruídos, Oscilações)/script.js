const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// Variáveis de animação
let time = 0;
let noiseOffset = Math.random() * 1000; // Deslocamento para o ruído Perlin
const amplitude = 50; // Amplitude das ondas
const frequency = 0.1; // Frequência das ondas
const waveSpeed = 0.05; // Velocidade do movimento das ondas

// Função seno para criar ondas simples
function sineWave(x, time) {
  return amplitude * Math.sin(frequency * x + time);
}

// Função para gerar ruído Perlin (usando um simples ruído aleatório)
function perlinNoise(x, time) {
  const noise = Math.sin(x * 0.1 + noiseOffset + time); // Simulação simples de ruído
  return noise * amplitude;
}

// Função para desenhar uma onda no canvas
function drawWave(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    let y = 0;

    // Adiciona ondas baseadas em seno
    y += sineWave(x, time);

    // Adiciona ruído Perlin para um movimento mais natural
    y += perlinNoise(x, time);

    // Desenha o ponto da onda
    ctx.lineTo(x, canvas.height / 2 + y);
  }

  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

// Função para atualizar a animação
function updateAnimation() {
  time += waveSpeed; // Atualiza o tempo para o movimento da onda

  // Desenha as ondas com base no tempo atual
  drawWave(time);

  // Solicita o próximo quadro de animação
  requestAnimationFrame(updateAnimation);
}

// Inicia a animação
updateAnimation();
