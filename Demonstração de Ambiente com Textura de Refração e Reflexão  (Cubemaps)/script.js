// Configurações iniciais para o WebGLRenderer
const canvas = document.getElementById('webglCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Configuração da cena
const scene = new THREE.Scene();

// Criação da câmera (perspectiva)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Adicionando uma luz à cena para iluminar os objetos
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

// Função para carregar o cubemap (skybox)
const loadCubeMap = () => {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    'images/px.jpg', 'images/nx.jpg', // lado positivo e negativo em X
    'images/py.jpg', 'images/ny.jpg', // lado positivo e negativo em Y
    'images/pz.jpg', 'images/nz.jpg'  // lado positivo e negativo em Z
  ]);
  scene.background = texture; // Definindo o cubemap como o fundo
  return texture;
};

// Carregando o cubemap
const cubeTexture = loadCubeMap();

// Criando a esfera
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Material para a esfera com reflexões e refrações (aqui alternaremos entre materiais)
const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xAAAAAA,
  roughness: 0.1,
  metalness: 0,
  envMap: cubeTexture,
  refractionRatio: 0.98
});

const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xAAAAAA,
  roughness: 0.2,
  metalness: 1,
  envMap: cubeTexture
});

const mirrorMaterial = new THREE.MeshStandardMaterial({
  color: 0xAAAAAA,
  roughness: 0,
  metalness: 1,
  envMap: cubeTexture
});

// Criando a esfera com o material de vidro inicialmente
const sphere = new THREE.Mesh(sphereGeometry, glassMaterial);
scene.add(sphere);

// Função para alternar materiais
let currentMaterial = glassMaterial;

const toggleMaterial = () => {
  if (currentMaterial === glassMaterial) {
    currentMaterial = metalMaterial;
    sphere.material = metalMaterial;
  } else if (currentMaterial === metalMaterial) {
    currentMaterial = mirrorMaterial;
    sphere.material = mirrorMaterial;
  } else {
    currentMaterial = glassMaterial;
    sphere.material = glassMaterial;
  }
};

// Criando uma interface para alternar os materiais
document.addEventListener('click', toggleMaterial);

// Animação
function animate() {
  requestAnimationFrame(animate);

  // Rotacionando a esfera para visualizar as reflexões e refrações
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// Iniciando a animação
animate();

// Ajustando a cena quando a janela for redimensionada
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
