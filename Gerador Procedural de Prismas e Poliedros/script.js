// Configuração inicial do WebGL
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');
canvas.width = 500;
canvas.height = 500;

// Função para criar vértices e faces do poliedro
function generatePrismGeometry(sides, height) {
  const vertices = [];
  const indices = [];

  // Ângulo para definir as posições dos vértices na base
  const angleStep = 2 * Math.PI / sides;
  
  // Gerando vértices da base inferior
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    vertices.push(x, 0, z); // Base inferior
  }

  // Gerando vértices da base superior
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    vertices.push(x, height, z); // Base superior
  }

  // Gerando faces
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;

    // Faces laterais (triângulos)
    indices.push(i, next, i + sides);
    indices.push(next, next + sides, i + sides);

    // Faces inferiores (triângulos)
    if (i < sides - 1) {
      indices.push(i, next, sides * 2);
    }

    // Faces superiores (triângulos)
    if (i < sides - 1) {
      indices.push(i + sides, next + sides, sides * 2 + 1);
    }
  }

  return { vertices, indices };
}

// Função para carregar e compilar shaders
function loadShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Erro ao compilar shader', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Função para criar o programa WebGL
function createShaderProgram(vertexShaderSource, fragmentShaderSource) {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Erro ao linkar o programa shader', gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

// Função para gerar o Prisma e renderizar
function generatePrism() {
  const sides = parseInt(document.getElementById('sides').value, 10);
  const height = parseFloat(document.getElementById('height').value);

  const { vertices, indices } = generatePrismGeometry(sides, height);

  // Shaders simples para renderizar o objeto 3D
  const vertexShaderSource = `
    attribute vec3 aPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }
  `;
  
  const fragmentShaderSource = `
    void main() {
      gl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);
    }
  `;

  const shaderProgram = createShaderProgram(vertexShaderSource, fragmentShaderSource);
  const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
  const modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
  const projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

  // Criação do buffer de vértices
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Criação do buffer de índices
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // Ativar o programa de shaders
  gl.useProgram(shaderProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttribLocation);

  // Matriz de projeção (perspectiva simples)
  const projectionMatrix = new Float32Array([
    1.0, 0, 0, 0,
    0, 1.0, 0, 0,
    0, 0, -2.0, -1.0,
    0, 0, -1.0, 0
  ]);
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

  // Matriz de visualização
  const modelViewMatrix = new Float32Array([
    1.0, 0, 0, 0,
    0, 1.0, 0, -5.0,
    0, 0, 1.0, -10.0,
    0, 0, 0, 1.0
  ]);
  gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

  // Limpar a tela e desenhar o poliedro
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

// Inicialização do WebGL
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
