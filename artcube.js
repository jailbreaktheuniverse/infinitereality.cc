// Initialize scene, camera, and renderer for the main scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize the background scene and camera
const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
backgroundCamera.position.z = 5;

// GitHub repository details
const owner = 'jailbreaktheuniverse';
const repo = 'infinitereality.cc';
const path = 'art';

// Declare variables at the top of your script to ensure they're accessible globally
let dodecahedron;
let currentBackgroundMesh;
let selectedUrls = []; // This will hold the URLs of the selected images

// Raycaster for detecting clicks on the dodecahedron
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle interaction (both touch and click)
function onInteract(event) {
    event.preventDefault();

    let x, y;

    // Check if the event is a touch event
    if (event.changedTouches) {
        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;
    } else { // Else, it's a mouse event
        x = event.clientX;
        y = event.clientY;
    }

    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = - (y / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        if (intersectedObject === dodecahedron) {
            const materialIndex = intersects[0].face.materialIndex;
            const selectedImageUrl = selectedUrls[materialIndex];
            window.open(selectedImageUrl, '_blank'); // Open the full-resolution image in a new tab
        }
    }
}

// Add event listeners for both touch and click
window.addEventListener('click', onInteract, false);
window.addEventListener('touchstart', onInteract, false);

// Fetch the list of images from the GitHub repository and initialize the dodecahedron and background
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => response.json())
    .then(data => {
        const imageUrls = data.filter(item => item.name.match(/\.(jpg|jpeg|png|gif)$/i))
                              .map(item => item.download_url);

        // Randomly select 12 images for the dodecahedron
        selectedUrls = imageUrls.sort(() => 0.5 - Math.random()).slice(0, 12);

        // Initialize the background with the first selected image
        updateBackground(selectedUrls[0]);

        // Initialize the dodecahedron with the selected images
        const verticalFitFactor = 1.5; // Adjust this factor as needed to fit the dodecahedron within the window
        const radius = (window.innerHeight / verticalFitFactor) / window.devicePixelRatio;
        const geometry = new THREE.DodecahedronGeometry(radius, 0);
        const materials = selectedUrls.map(url => new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(url) }));

        dodecahedron = new THREE.Mesh(geometry, materials);
        scene.add(dodecahedron);
        camera.position.z = radius * 3; // Adjust camera position based on dodecahedron size

        // Start the animation loop after the dodecahedron has been created
        animate();
    });

// Function to update the background image
function updateBackground(imageUrl) {
    if (currentBackgroundMesh) {
        // Remove the previous mesh from the scene
        backgroundScene.remove(currentBackgroundMesh);
        // Dispose of the previous texture and material to free up resources
        currentBackgroundMesh.material.map.dispose();
        currentBackgroundMesh.material.dispose();
    }

    const texture = new THREE.TextureLoader().load(imageUrl, function (texture) {
        // Ensure the texture covers the whole background
        const aspectRatio = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(20 * aspectRatio, 20, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture, depthTest: false });
        currentBackgroundMesh = new THREE.Mesh(geometry, material);

        // Adjust the position and scale to ensure visibility
        currentBackgroundMesh.position.set(0, 0, -10);
        backgroundScene.add(currentBackgroundMesh);
    });
}

// Animation loop to render both scenes
function animate() {
    requestAnimationFrame(animate);

    // Ensure dodecahedron is defined before attempting to access its properties
    if (dodecahedron) {
        dodecahedron.rotation.x += 0.01;
        dodecahedron.rotation.y += 0.01;
    }

    renderer.autoClear = false;
    renderer.clear();
    renderer.render(backgroundScene, backgroundCamera);
    renderer.render(scene, camera);
}

animate();
