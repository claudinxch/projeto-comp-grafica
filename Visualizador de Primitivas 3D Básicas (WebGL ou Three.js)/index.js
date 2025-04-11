let scene, camera, renderer, controls;
let geometry, material, mesh;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    document.getElementById("viewer").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    material = new THREE.MeshNormalMaterial();
    changeGeometry("cube");

    animate();
}

function changeGeometry(type) {
    if (mesh) scene.remove(mesh);

    switch (type) {
        case "cube":
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case "sphere":
            geometry = new THREE.SphereGeometry(0.8, 32, 32);
            break;
        case "pyramid":
            geometry = new THREE.ConeGeometry(0.8, 1.2, 4);
            break;
        case "torus":
            geometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
            break;
    }

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
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
