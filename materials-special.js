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

camera.position.set(0, 2, 12);


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

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);


// ----------------------------------------------------
// Lights
// ----------------------------------------------------

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.4
    );

scene.add(ambientLight);


const pointLight =
    new THREE.PointLight(
        0xffffff,
        60,
        100
    );

pointLight.position.set(0,4,5);
scene.add(pointLight);


// ----------------------------------------------------
// Light Marker
// ----------------------------------------------------

const marker =
    new THREE.Mesh(
        new THREE.SphereGeometry(0.2,16,16),
        new THREE.MeshBasicMaterial({
            color:0xffff00
        })
    );

pointLight.add(marker);


// ----------------------------------------------------
// Floor
// ----------------------------------------------------

const floor =
    new THREE.Mesh(
        new THREE.PlaneGeometry(30,30),
        new THREE.MeshStandardMaterial({
            color:0x555555
        })
    );

floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;

scene.add(floor);


// ----------------------------------------------------
// Background Torus
// ----------------------------------------------------

const torus =
    new THREE.Mesh(
        new THREE.TorusGeometry(
            8,
            0.18,
            18,
            150
        ),
        new THREE.MeshStandardMaterial({
            color:0xffb703,
            emissive:0x331500,
            metalness:0.7,
            roughness:0.35
        })
    );

torus.rotation.x = Math.PI / 2;
torus.position.z = -3;

scene.add(torus);


// ----------------------------------------------------
// Geometry
// ----------------------------------------------------

const sphereGeometry =
    new THREE.SphereGeometry(
        1,
        64,
        64
    );


// ----------------------------------------------------
// Toon Gradient Texture
// ----------------------------------------------------

const gradientData =
    new Uint8Array([
        0,
        80,
        160,
        255
    ]);

const gradientTexture =
    new THREE.DataTexture(
        gradientData,
        4,
        1,
        THREE.RedFormat
    );

gradientTexture.needsUpdate = true;


// ----------------------------------------------------
// MeshToonMaterial
// ----------------------------------------------------

const toonMaterial =
    new THREE.MeshToonMaterial({
        color:0x00ff00,
        gradientMap:gradientTexture
    });


// ----------------------------------------------------
// MeshNormalMaterial
// ----------------------------------------------------

const normalMaterial =
    new THREE.MeshNormalMaterial();


// ----------------------------------------------------
// MatCap Texture
// ----------------------------------------------------

const size = 256;

const matcapData =
    new Uint8Array(size * size * 4);

for (let y = 0; y < size; y++)
{
    for (let x = 0; x < size; x++)
    {
        const index =
            (y * size + x) * 4;

        const dx =
            (x - size / 2) /
            (size / 2);

        const dy =
            (y - size / 2) /
            (size / 2);

        const dist =
            Math.sqrt(dx * dx + dy * dy);

        const shade =
            Math.max(
                0,
                255 - dist * 255
            );

        matcapData[index] =
            shade;

        matcapData[index + 1] =
            shade;

        matcapData[index + 2] =
            255;

        matcapData[index + 3] =
            255;
    }
}

const matcapTexture =
    new THREE.DataTexture(
        matcapData,
        size,
        size,
        THREE.RGBAFormat
    );

matcapTexture.needsUpdate = true;


// ----------------------------------------------------
// MeshMatcapMaterial
// ----------------------------------------------------

const matcapMaterial =
    new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
    });


// ----------------------------------------------------
// Transparent Material
// ----------------------------------------------------

const transparentMaterial =
    new THREE.MeshPhysicalMaterial({
        color: 0x7ec8ff,
        transparent: true,
        opacity: 0.55,
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.7,
        thickness: 0.8,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
    });


// ----------------------------------------------------
// Create Spheres
// ----------------------------------------------------

const toonSphere =
    new THREE.Mesh(
        sphereGeometry,
        toonMaterial
    );

toonSphere.position.x = -6;


const normalSphere =
    new THREE.Mesh(
        sphereGeometry,
        normalMaterial
    );

normalSphere.position.x = -2;


const matcapSphere =
    new THREE.Mesh(
        sphereGeometry,
        matcapMaterial
    );

matcapSphere.position.x = 2;


const transparentSphere =
    new THREE.Mesh(
        sphereGeometry,
        transparentMaterial
    );

transparentSphere.position.x = 6;


scene.add(toonSphere);
scene.add(normalSphere);
scene.add(matcapSphere);
scene.add(transparentSphere);


// ----------------------------------------------------
// Labels
// ----------------------------------------------------

console.log("Left Sphere = Toon");
console.log("Second Sphere = Normal");
console.log("Third Sphere = Matcap");
console.log("Right Sphere = Transparent");


// ----------------------------------------------------
// Rotation Control
// ----------------------------------------------------

let rotateObjects = false;


// ----------------------------------------------------
// Keyboard
// ----------------------------------------------------

window.addEventListener(
    'keydown',
    (event)=>
{
    const key =
        event.key.toLowerCase();

    switch(key)
    {
        case '1':
            pointLight.color.set(
                0xffffff
            );
            break;

        case '2':
            pointLight.color.set(
                0xff0000
            );
            break;

        case '3':
            pointLight.color.set(
                0x0000ff
            );
            break;

        case 'r':
            rotateObjects =
                !rotateObjects;
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
    requestAnimationFrame(
        animate
    );

    if(rotateObjects)
    {
        toonSphere.rotation.y += 0.01;
        normalSphere.rotation.y += 0.01;
        matcapSphere.rotation.y += 0.01;
        transparentSphere.rotation.y += 0.01;

        toonSphere.rotation.x += 0.003;
        normalSphere.rotation.x += 0.003;
        matcapSphere.rotation.x += 0.003;
        transparentSphere.rotation.x += 0.003;
    }

    renderer.render(
        scene,
        camera
    );
}

animate();


// ----------------------------------------------------
// Resize
// ----------------------------------------------------

window.addEventListener(
    'resize',
    () =>
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