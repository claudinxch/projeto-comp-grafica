let scene, camera, renderer, controls, cube;
let startTime = null;
let duration = 2000; // Duração da animação em milissegundos
let startPos = new THREE.Vector3(-2, 0, 0);
let endPos = new THREE.Vector3(2, 0, 0);

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    document.getElementById("viewer").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    cube = new THREE.Mesh(geometry, material);
    cube.position.copy(startPos);
    scene.add(cube);

    animate();
}

function easeIn(t) {
    return t * t;
}

function easeOut(t) {
    return t * (2 - t);
}

function bezier(t) {
    return 3 * t * t - 2 * t * t * t;
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function animate(timestamp) {
    requestAnimationFrame(animate);
    controls.update();
    
    if (startTime !== null) {
        let elapsed = timestamp - startTime;
        let t = Math.min(elapsed / duration, 1);
        
        let type = document.getElementById("interpolation").value;
        
        if (type === "ease-in") {
            t = easeIn(t);
        } else if (type === "ease-out") {
            t = easeOut(t);
        } else if (type === "bezier") {
            t = bezier(t);
        }

        cube.position.x = lerp(startPos.x, endPos.x, t);

        if (t >= 1) startTime = null;
    }

    renderer.render(scene, camera);
}

function startAnimation() {
    startTime = performance.now();
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

init();
