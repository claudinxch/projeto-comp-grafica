let scene, camera, renderer, controls, light, mesh;
let material, geometry;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    document.getElementById("viewer").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    changeGeometry();
    animate();
}

function changeGeometry() {
    if (mesh) scene.remove(mesh);

    let shape = document.getElementById("shape").value;

    switch (shape) {
        case "cube":
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case "sphere":
            geometry = new THREE.SphereGeometry(0.8, 32, 32);
            break;
        case "cylinder":
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
            break;
        case "torus":
            geometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
            break;
    }

    changeMaterial();
}

function changeMaterial() {
    let shading = document.getElementById("shading").value;

    switch (shading) {
        case "flat":
            material = new THREE.MeshPhongMaterial({ color: 0x44aa88, flatShading: true });
            break;
        case "gouraud":
            material = new THREE.MeshLambertMaterial({ color: 0x44aa88 });
            break;
        case "phong":
            material = new THREE.MeshPhongMaterial({ color: 0x44aa88, shininess: 100 });
            break;
    }

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function updateLight() {
    light.intensity = parseFloat(document.getElementById("lightIntensity").value);
    light.position.set(
        parseFloat(document.getElementById("lightX").value),
        parseFloat(document.getElementById("lightY").value),
        parseFloat(document.getElementById("lightZ").value)
    );
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
