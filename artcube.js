// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GitHub repository details
const owner = 'jailbreaktheuniverse';
const repo = 'infinitereality.cc';
const path = 'art';

// Raycaster for detecting clicks on the cube
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle mouse clicks
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object === cube) {
            const materialIndex = intersects[i].face.materialIndex;
            const selectedImageUrl = selectedUrls[materialIndex];
            window.open(selectedImageUrl, '_blank'); // Open the full-resolution image in a new tab
            break;
        }
    }
}

// Add event listener for mouse clicks
window.addEventListener('click', onMouseClick, false);

// Fetch the list of images from the GitHub repository
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => response.json())
    .then(data => {
        // Filter out non-image files if necessary and map to their download URLs
        const imageUrls = data.filter(item => item.name.match(/\.(jpg|jpeg|png|gif)$/i))
                              .map(item => item.download_url);

        // Randomly select 6 images
        const selectedUrls = imageUrls.sort(() => 0.5 - Math.random()).slice(0, 6);

        // Load textures from the selected URLs
        const textures = selectedUrls.map(url => new THREE.TextureLoader().load(url));

        // Adjust the cube size based on the window height
        const size = window.innerHeight * 0.75 / window.devicePixelRatio; // Adjust the 0.75 as needed
        const geometry = new THREE.BoxGeometry(size, size, size);

        // Create a cube with the selected images
        const materialArray = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
        const cube = new THREE.Mesh(geometry, materialArray);
        scene.add(cube);

        // Position the camera
        camera.position.z = size * 1.5; // Adjust camera position based on cube size

        // Function to animate the cube
        function animate() {
            requestAnimationFrame(animate);

            // Rotate the cube
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            // Render the scene
            renderer.render(scene, camera);
        }

        // Start the animation loop
        animate();
    })
    .catch(error => console.error('Error fetching image data:', error));
