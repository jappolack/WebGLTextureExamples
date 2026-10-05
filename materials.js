import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.168/build/three.module.js';


// ----------------------------------------------------
// Scene
// ----------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);


// ----------------------------------------------------
// Camera
// ----------------------------------------------------

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 15);


// ----------------------------------------------------
// Renderer
// ----------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);


// ----------------------------------------------------
// Lights
// ----------------------------------------------------

const ambientLight =
    new THREE.AmbientLight(0xffffff, 0.3);

scene.add(ambientLight);


const pointLight =
    new THREE.PointLight(
        0xffffff,
        60,
        100
    );

pointLight.position.set(0, 5, 6);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.bias = -0.0001;

scene.add(pointLight);


// Light marker

const lightMarker =
    new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({
            color: 0xffff00
        })
    );

pointLight.add(lightMarker);


// ----------------------------------------------------
// Ground
// ----------------------------------------------------

const floor =
    new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.85,
            metalness: 0
        })
    );

floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;

scene.add(floor);


// ----------------------------------------------------
// Geometry
// ----------------------------------------------------

const geometry =
    new THREE.SphereGeometry(
        1,
        64,
        64
    );


// ----------------------------------------------------
// Materials
// ----------------------------------------------------

// Basic

const basicMat =
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });

// Lambert

const lambertMat =
    new THREE.MeshLambertMaterial({
        color: 0x00ff00
    });

// Phong

const phongMat =
    new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        shininess: 100
    });

// Standard

const standardMat =
    new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        roughness: 0.4,
        metalness: 0.5
    });

// Physical

const physicalMat =
    new THREE.MeshPhysicalMaterial({
        color: 0x40ff80,
        roughness: 0.18,
        metalness: 0.85,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        sheen: 1,
        sheenColor: new THREE.Color(0x80ffb0),
        envMapIntensity: 2.5,
        reflectivity: 1
    });

// Rubber

const rubberTexture = (() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const index = (y * size + x) * 4;
            const grain = 50 + Math.random() * 50;
            const wave = Math.sin(x * 0.15) * 12 + Math.cos(y * 0.18) * 10;
            const value = Math.max(0, Math.min(255, grain + wave));

            data[index] = value;
            data[index + 1] = value;
            data[index + 2] = value;
            data[index + 3] = 255;
        }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.needsUpdate = true;
    return texture;
})();

const rubberMat =
    new THREE.MeshStandardMaterial({
        color: 0xf2f2f2,
        roughness: 0.9,
        metalness: 0.08,
        emissive: 0x1a1a1a,
        map: rubberTexture,
        envMapIntensity: 0.2
    });

// Gold

const goldMat =
    new THREE.MeshPhysicalMaterial({
        color: 0xd9a441,
        metalness: 0.9,
        roughness: 0.42,
        clearcoat: 0.7,
        clearcoatRoughness: 0.15,
        envMapIntensity: 1.8,
        reflectivity: 0.7,
        iridescence: 0.08,
        sheen: 0.7,
        sheenColor: new THREE.Color(0xffd666)
    });


// ----------------------------------------------------
// Create Spheres
// ----------------------------------------------------

const materialSpheres = [
    { mesh: new THREE.Mesh(geometry, basicMat), x: -9 },
    { mesh: new THREE.Mesh(geometry, lambertMat), x: -6 },
    { mesh: new THREE.Mesh(geometry, phongMat), x: -3 },
    { mesh: new THREE.Mesh(geometry, standardMat), x: 0 },
    { mesh: new THREE.Mesh(geometry, physicalMat), x: 3 },
    { mesh: new THREE.Mesh(geometry, rubberMat), x: 6 },
    { mesh: new THREE.Mesh(geometry, goldMat), x: 9 }
];

materialSpheres.forEach(({ mesh, x }) => {
    mesh.position.set(x, 0, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
});

const basicSphere = materialSpheres[0].mesh;
const lambertSphere = materialSpheres[1].mesh;
const phongSphere = materialSpheres[2].mesh;
const standardSphere = materialSpheres[3].mesh;
const physicalSphere = materialSpheres[4].mesh;
const rubberSphere = materialSpheres[5].mesh;
const goldSphere = materialSpheres[6].mesh;


// ----------------------------------------------------
// Array
// ----------------------------------------------------

const spheres = [
    basicSphere,
    lambertSphere,
    phongSphere,
    standardSphere,
    physicalSphere,
    rubberSphere,
    goldSphere
];


// ----------------------------------------------------
// Keyboard Controls
// ----------------------------------------------------

let rotateObjects = false;

window.addEventListener('keydown', (event) =>
{
    const key = event.key.toLowerCase();

    switch(key)
    {
        case '1':
            pointLight.color.set(0xffffff);
            console.log("White light");
            break;

        case '2':
            pointLight.color.set(0xff0000);
            console.log("Red light");
            break;

        case '3':
            pointLight.color.set(0x0000ff);
            console.log("Blue light");
            break;

        case 'r':
            rotateObjects = !rotateObjects;
            break;

        case 'arrowleft':
            pointLight.position.x -= 1;
            break;

        case 'arrowright':
            pointLight.position.x += 1;
            break;

        case 'arrowup':
            pointLight.position.y += 1;
            break;

        case 'arrowdown':
            pointLight.position.y -= 1;
            break;
    }
});


// ----------------------------------------------------
// Animation
// ----------------------------------------------------

function animate()
{
    requestAnimationFrame(animate);

    if(rotateObjects)
    {
        spheres.forEach((sphere) =>
        {
            sphere.rotation.y += 0.01;
            sphere.rotation.x += 0.003;
        });
    }

    renderer.render(scene, camera);
}

animate();


// ----------------------------------------------------
// Resize
// ----------------------------------------------------

window.addEventListener('resize', () =>
{
    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});