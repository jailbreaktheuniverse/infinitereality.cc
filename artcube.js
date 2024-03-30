// Initialize scene, camera, and renderer for the main scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add an AudioListener to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// Initialize the background scene and camera
const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
backgroundCamera.position.z = 5;

// GitHub repository details
const owner = 'jailbreaktheuniverse';
const repo = 'infinitereality.cc';
const path = 'art';

// Declare variables at the top of your script to ensure they're accessible globally
let cube;
let currentBackgroundMesh;
let selectedUrls = []; // This will hold the URLs of the selected images

// Raycaster for detecting clicks on the cube
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
    } else {
        // Else, it's a mouse event
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
        if (intersectedObject === cube) {
            const materialIndex = intersects[0].face.materialIndex;
            const selectedImageUrl = selectedUrls[materialIndex];
            window.open(selectedImageUrl, '_blank'); // Open the full-resolution image in a new tab
        }
    }

    // Attempt to play or resume audio on user interaction
    if (sound.context.state === 'suspended') {
        sound.context.resume();
    }
}

// Add event listeners for both touch and click
window.addEventListener('click', onInteract, false);
window.addEventListener('touchstart', onInteract, false);

// Load and play spatial audio
const audioLoader = new THREE.AudioLoader();
const sound = new THREE.PositionalAudio(listener);

audioLoader.load('Artcube.m4a', function(buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(20);
    sound.setLoop(true);
    sound.setVolume(0.5);
    // sound.play(); // Removed the immediate play call
});

// Fetch the list of images from the GitHub repository and initialize the cube and background
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
.then(response => response.json())
.then(data => {
    const imageUrls = data.filter(item => item.name.match(/\.(jpg|jpeg|png|gif)$/i))
    .map(item => item.download_url);

    // Randomly select 6 images for the cube, use the first for the background
    selectedUrls = imageUrls.sort(() => 0.5 - Math.random()).slice(0, 6);

    // Initialize the background with the first selected image
    updateBackground(selectedUrls[0]);

    // Initialize the cube with the selected images
    const size = window.innerHeight * 0.75 / window.devicePixelRatio;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const textures = selectedUrls.map(url => new THREE.TextureLoader().load(url));
    const materialArray = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
    cube = new THREE.Mesh(geometry, materialArray);
    scene.add(cube);
    camera.position.z = size * 1.5;

    cube.add(sound); // Attach the sound to the cube

    // Start the animation loop after the cube has been created
    animate();
});

// Function to update the background image
function updateBackground(imageUrl) {
    // [Background update logic remains unchanged]
}

// Animation loop to render both scenes
function animate() {
    // [Animation logic remains unchanged]
}
animate();
