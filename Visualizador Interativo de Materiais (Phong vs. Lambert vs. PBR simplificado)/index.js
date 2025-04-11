let scene, camera, renderer, controls, light, mesh, material, geometry;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    document.getElementById("viewer").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    geometry = new THREE.SphereGeometry(1, 32, 32);
    changeMaterial();

    animate();
}

function changeMaterial() {
    if (mesh) scene.remove(mesh);

    let type = document.getElementById("materialType").value;

    switch (type) {
        case "lambert":
            material = new THREE.MeshLambertMaterial({ color: 0x44aa88 });
            break;
        case "phong":
            material = new THREE.MeshPhongMaterial({ color: 0x44aa88, shininess: 100 });
            break;
        case "blinn":
            material = new THREE.MeshPhongMaterial({ color: 0x44aa88, shininess: 200 });
            break;
        case "pbr":
            material = new THREE.MeshStandardMaterial({ color: 0x44aa88, metalness: 0.5, roughness: 0.5 });
            break;
    }

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function updateMaterial() {
    if (material.isMeshStandardMaterial) {
        material.metalness = parseFloat(document.getElementById("metalness").value);
        material.roughness = parseFloat(document.getElementById("roughness").value);
    }
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
