import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// HDR works best with ACES tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/*
-----------------------------------------------------
Load HDR Environment
-----------------------------------------------------
*/

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader()
    .load('studio.hdr', function (texture) {

        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.environment = envMap;
        scene.background = envMap;

        texture.dispose();
        pmremGenerator.dispose();

    });

/*
-----------------------------------------------------
Objects
-----------------------------------------------------
*/

// Reflective gold sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhysicalMaterial({
        color: 0xffcc44,
        metalness: 1,
        roughness: 0.05
    })
);

sphere.position.x = -2;
scene.add(sphere);

// Chrome sphere
const chromeSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0
    })
);

chromeSphere.position.x = 2;
scene.add(chromeSphere);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.8
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;
scene.add(floor);

/*
-----------------------------------------------------
Animation
-----------------------------------------------------
*/

function animate() {

    requestAnimationFrame(animate);

    sphere.rotation.y += 0.01;
    chromeSphere.rotation.y -= 0.01;

    controls.update();

    renderer.render(scene, camera);
}

animate();

/*
-----------------------------------------------------
Resize
-----------------------------------------------------
*/

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});