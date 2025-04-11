// Obtendo o canvas onde renderizaremos o modelo
const canvas = document.getElementById('webglCanvas');

// Criando uma cena 3D com Three.js
const scene = new THREE.Scene();

// Criando a câmera (visão perspectiva)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Criando o renderizador WebGL
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criando geometria para o corpo (um cilindro simples)
const geometry = new THREE.CylinderGeometry(1, 1, 3, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const body = new THREE.Mesh(geometry, material);
scene.add(body);

// Adicionando ossos (esferas) à cena
const bones = [];
const boneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Criando dois ossos (esferas)
for (let i = 0; i < 2; i++) {
  const boneGeometry = new THREE.SphereGeometry(0.2);
  const bone = new THREE.Mesh(boneGeometry, boneMaterial);
  bone.position.set(0, i * 1.5, 0); // Posiciona os ossos em diferentes alturas
  bones.push(bone);
  scene.add(bone);
}

// Conectando os ossos entre si (simulando uma cadeia)
bones[0].add(bones[1]);

// Ajustando a posição da câmera
camera.position.z = 5;

// Variável de controle de tempo
let time = 0;

// Função de animação (rotacionando os ossos e deformando o corpo)
function animate() {
  time += 0.01;  // Incrementa o tempo para animação contínua
  
  // Animando os ossos (simples rotação)
  bones[0].rotation.x = Math.sin(time);  // Ossos rotacionando
  bones[1].rotation.x = Math.cos(time);
  
  // Deformando o corpo (cilindro) baseado no movimento dos ossos
  body.rotation.x = Math.sin(time) * 0.5;  // Corpo se movendo de acordo com a rotação dos ossos

  // Renderizando a cena
  renderer.render(scene, camera);

  // Solicita o próximo quadro de animação
  requestAnimationFrame(animate);
}

// Ajustando o tamanho do canvas quando a janela for redimensionada
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Inicia a animação
animate();
