// Obter o contexto WebGL
const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

// Função para verificar se o WebGL é suportado
if (!gl) {
    alert('WebGL não é suportado neste navegador.');
}

// Definir os shaders (vertex e fragmento)
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projectionMatrix;
    
    varying vec2 v_texCoord;

    void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
        v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform sampler2D u_texture;
    varying vec2 v_texCoord;

    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
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

// Obter locais de atributos e uniformes
const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
const texCoordAttribLocation = gl.getAttribLocation(program, 'a_texCoord');
const modelViewMatrixLocation = gl.getUniformLocation(program, 'u_modelViewMatrix');
const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix');
const textureLocation = gl.getUniformLocation(program, 'u_texture');

// Dados do cubo 3D
const vertices = new Float32Array([
    // Vértices e coordenadas de textura de um cubo
    -0.5, -0.5, -0.5,   0.0, 0.0,
    0.5, -0.5, -0.5,    1.0, 0.0,
    0.5,  0.5, -0.5,    1.0, 1.0,
    -0.5,  0.5, -0.5,   0.0, 1.0,
    
    -0.5, -0.5,  0.5,   0.0, 0.0,
    0.5, -0.5,  0.5,    1.0, 0.0,
    0.5,  0.5,  0.5,    1.0, 1.0,
    -0.5,  0.5,  0.5,   0.0, 1.0,
]);

const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,   // face frontal
    4, 5, 6,  4, 6, 7,   // face traseira
    0, 1, 5,  0, 5, 4,   // face inferior
    2, 3, 7,  2, 7, 6,   // face superior
    1, 2, 6,  1, 6, 5,   // face direita
    0, 3, 7,  0, 7, 4    // face esquerda
]);

// Carregar a textura animada (Sprite Sheet)
const textureImage = new Image();
textureImage.src = 'spritesheet.png'; // Caminho para o Sprite Sheet
textureImage.onload = () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
    gl.generateMipmap(gl.TEXTURE_2D);
};

// Criar buffers
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

// Função para inicializar a matriz de modelo e visão
function initModelViewMatrix(rotation) {
    const modelViewMatrix = new Float32Array(16);
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);

    // Matriz de rotação simples ao redor do eixo Y
    modelViewMatrix[0] = cosR;
    modelViewMatrix[1] = 0;
    modelViewMatrix[2] = sinR;
    modelViewMatrix[3] = 0;
    modelViewMatrix[4] = 0;
    modelViewMatrix[5] = 1;
    modelViewMatrix[6] = 0;
    modelViewMatrix[7] = 0;
    modelViewMatrix[8] = -sinR;
    modelViewMatrix[9] = 0;
    modelViewMatrix[10] = cosR;
    modelViewMatrix[11] = 0;
    modelViewMatrix[12] = 0;
    modelViewMatrix[13] = 0;
    modelViewMatrix[14] = -5;
    modelViewMatrix[15] = 1;

    return modelViewMatrix;
}

// Função para animar a cena
let rotation = 0;
let frameIndex = 0;
const totalFrames = 10; // Total de frames no Sprite Sheet (ajuste conforme necessário)

function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    // Enviar as matrizes de transformação
    const projectionMatrix = initProjectionMatrix();
    const modelViewMatrix = initModelViewMatrix(rotation);

    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

    // Calcular a posição da textura no Sprite Sheet
    const texWidth = 1.0 / totalFrames;
    const texX = (frameIndex % totalFrames) * texWidth;
    const texY = Math.floor(frameIndex / totalFrames) * texWidth;

    gl.uniform1i(textureLocation, 0); // Ativar textura

    // Atualizar a posição da textura
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Desenhar o cubo
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // Animar os frames do sprite sheet
    frameIndex = (frameIndex + 1) % totalFrames;

    // Animar a rotação
    rotation += 0.01;
    requestAnimationFrame(animate);
}

// Iniciar animação
gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.enable(gl.DEPTH_TEST);
animate();
