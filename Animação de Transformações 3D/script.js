// Obter o contexto WebGL
const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

// Função para verificar se o WebGL é suportado
if (!gl) {
    alert('WebGL não é suportado neste navegador.');
}

// Definir shaders (vertice e fragmento)
const vertexShaderSource = `
    attribute vec4 a_position;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projectionMatrix;
    void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // cor vermelha
    }
`;

// Função para compilar shaders
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Erro ao compilar shader: ', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Criar o programa WebGL
function createProgram(vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Erro ao linkar programa: ', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// Compilar e vincular shaders
const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
const program = createProgram(vertexShader, fragmentShader);

// Obter os locais dos atributos e uniformes
const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
const modelViewMatrixLocation = gl.getUniformLocation(program, 'u_modelViewMatrix');
const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix');

// Definir os vértices do cubo
const vertices = new Float32Array([
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,

    -0.5, -0.5,  0.5,
    0.5, -0.5,  0.5,
    0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5
]);

const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,   // face frontal
    4, 5, 6,  4, 6, 7,   // face traseira
    0, 1, 5,  0, 5, 4,   // face inferior
    2, 3, 7,  2, 7, 6,   // face superior
    1, 2, 6,  1, 6, 5,   // face direita
    0, 3, 7,  0, 7, 4    // face esquerda
]);

// Criar o buffer de vértices e indices
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Função para inicializar a projeção 3D
function initProjectionMatrix() {
    const projectionMatrix = new Float32Array(16);
    const fov = Math.PI / 4;
    const aspect = canvas.width / canvas.height;
    const near = 0.1;
    const far = 100;

    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const range = near - far;

    projectionMatrix[0] = f / aspect;
    projectionMatrix[5] = f;
    projectionMatrix[10] = (far + near) / range;
    projectionMatrix[11] = -1;
    projectionMatrix[14] = (2 * far * near) / range;
    projectionMatrix[15] = 0;

    return projectionMatrix;
}

// Função para inicializar a matriz de modelo e visão (transformação)
function initModelViewMatrix(rotationY) {
    const modelViewMatrix = new Float32Array(16);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);

    // Matriz de rotação ao redor do eixo Y
    modelViewMatrix[0] = cosY;
    modelViewMatrix[1] = 0;
    modelViewMatrix[2] = sinY;
    modelViewMatrix[3] = 0;
    modelViewMatrix[4] = 0;
    modelViewMatrix[5] = 1;
    modelViewMatrix[6] = 0;
    modelViewMatrix[7] = 0;
    modelViewMatrix[8] = -sinY;
    modelViewMatrix[9] = 0;
    modelViewMatrix[10] = cosY;
    modelViewMatrix[11] = 0;
    modelViewMatrix[12] = 0;
    modelViewMatrix[13] = 0;
    modelViewMatrix[14] = -5; // Posição na cena
    modelViewMatrix[15] = 1;

    return modelViewMatrix;
}

// Função para desenhar o cubo com rotação contínua
let rotationY = 0;
function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    // Enviar dados de vértices para o shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribLocation);

    // Enviar matrizes de transformação
    const projectionMatrix = initProjectionMatrix();
    const modelViewMatrix = initModelViewMatrix(rotationY);

    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

    // Desenhar o cubo
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // Atualizar a rotação
    rotationY += 0.01; // Velocidade de rotação
    requestAnimationFrame(animate);
}

// Iniciar animação
gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.enable(gl.DEPTH_TEST);
animate();
