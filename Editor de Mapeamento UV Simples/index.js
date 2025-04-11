let scene, camera, renderer, controls, mesh, material, geometry;
let textureLoader = new THREE.TextureLoader();
let texture;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    document.getElementById("viewer").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    changeTexture();
    changeGeometry();
    animate();
}

function changeTexture() {
    let textureType = document.getElementById("texture").value;
    
    if (textureType === "checker") {
        texture = new THREE.CanvasTexture(generateCheckerboard());
    } else {
        texture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');
    }
    
    updateMaterial();
}

function generateCheckerboard(size = 256) {
    let canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    let ctx = canvas.getContext('2d');
    let step = size / 8;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? 'white' : 'black';
            ctx.fillRect(x * step, y * step, step, step);
        }
    }

    return canvas;
}

function changeGeometry() {
    if (mesh) scene.remove(mesh);

    let shape = document.getElementById("shape").value;
    
    if (shape === "cube") {
        geometry = new THREE.BoxGeometry(1, 1, 1);
    } else {
        geometry = new THREE.SphereGeometry(1, 32, 32);
    }
    
    updateMaterial();
}

function updateMaterial() {
    material = new THREE.MeshStandardMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function updateUV() {
    if (!material.map) return;

    let scaleU = parseFloat(document.getElementById("scaleU").value);
    let scaleV = parseFloat(document.getElementById("scaleV").value);

    material.map.repeat.set(scaleU, scaleV);
    material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
    material.map.needsUpdate = true;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

init();
