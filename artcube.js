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

        // Create a cube with the selected images
        const geometry = new THREE.BoxGeometry();
        const materialArray = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
        const cube = new THREE.Mesh(geometry, materialArray);
        scene.add(cube);

        // Position the camera
        camera.position.z = 5;

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
