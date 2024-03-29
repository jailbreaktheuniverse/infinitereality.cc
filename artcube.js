// Initialize scene, camera, and renderer for the main scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
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

// Raycaster for detecting clicks on the cube
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Declare cube variable at the top of your script to ensure it's accessible globally
let cube;
let currentBackgroundMesh;
let selectedUrls = []; // This will hold the URLs of the selected images

// Function to handle mouse clicks
function onMouseClick(event) {
    event.preventDefault();

    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

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
}

// Add event listener for mouse clicks
window.addEventListener('click', onMouseClick, false);

// Function to update the background image
function updateBackground(imageUrl) {
    if (currentBackgroundMesh) {
        // Remove the previous mesh from the scene
        backgroundScene.remove(currentBackgroundMesh);
        // Dispose of the previous texture and material to free up resources
        currentBackgroundMesh.material.map.dispose();
        currentBackgroundMesh.material.dispose();
    }

    // Load the new texture and create a new mesh
    const texture = new THREE.TextureLoader().load(imageUrl, function (texture) {
        // Adjust the plane geometry size based on the image aspect ratio and camera view
        const aspectRatio = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(20 * aspectRatio, 20);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        currentBackgroundMesh = new THREE.Mesh(geometry, material);

        // Position the mesh in the background
        currentBackgroundMesh.position.z = -10; // Move the mesh back so it doesn't overlap with the main scene

        backgroundScene.add(currentBackgroundMesh);
    });
}

// Fetch the list of images from the GitHub repository
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => response.json())
    .then(data => {
        // Filter out non-image files if necessary and map to their download URLs
        const imageUrls = data.filter(item => item.name.match(/\.(jpg|jpeg|png|gif)$/i))
                              .map(item => item.download_url);

        // Randomly select 6 images for the cube
        selectedUrls = imageUrls.sort(() => 0.5 - Math.random()).slice(0, 6);

        // Load textures from the selected URLs for the cube
        const textures = selectedUrls.map(url => new THREE.TextureLoader().load(url));

        // Create a cube with the selected images
        const size = window.innerHeight * 0.75 / window.devicePixelRatio; // Adjust the 0.75 as needed
        const geometry = new THREE.BoxGeometry(size, size, size);
        const materialArray = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
        cube = new THREE.Mesh(geometry, materialArray);
        scene.add(cube);

        // Position the camera
        camera.position.z = size * 1.5; // Adjust camera position based on cube size

        // Initially set the background to the first selected image
        updateBackground(selectedUrls[0]);

        // Function to animate the scenes
        function animate() {
            requestAnimationFrame(animate);

            // Rotate the cube
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            // Render the background scene first
            renderer.render(backgroundScene, backgroundCamera);

            // Then render the main scene
            renderer.render(scene, camera);
        }

        // Start the animation loop
        animate();
    })
    .catch(error => console.error('Error fetching image data:', error));
