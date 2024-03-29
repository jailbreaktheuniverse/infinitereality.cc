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

// Declare cube variable at the top of your script to ensure it's accessible globally
let cube;
let currentBackgroundMesh;

// GitHub repository details
const owner = 'jailbreaktheuniverse';
const repo = 'infinitereality.cc';
const path = 'art';

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

// Fetch the list of images from the GitHub repository and initialize the cube and background
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => response.json())
    .then(data => {
        const imageUrls = data.filter(item => item.name.match(/\.(jpg|jpeg|png|gif)$/i))
                              .map(item => item.download_url);

        // Randomly select 6 images for the cube, use the first for the background
        const selectedUrls = imageUrls.sort(() => 0.5 - Math.random()).slice(0, 6);
        updateBackground(selectedUrls[0]); // Initialize the background with the first selected image

        // Initialize the cube with the selected images
        const size = window.innerHeight * 0.75 / window.devicePixelRatio;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const textures = selectedUrls.map(url => new THREE.TextureLoader().load(url));
        const materialArray = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
        cube = new THREE.Mesh(geometry, materialArray);
        scene.add(cube);
        camera.position.z = size * 1.5;
    });

// Add event listener for mouse clicks, handling cube clicks
window.addEventListener('click', function(event) {
    // Mouse click handling logic here
});

// Animation loop to render both scenes
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(backgroundScene, backgroundCamera);
    renderer.render(scene, camera);
}

animate();
