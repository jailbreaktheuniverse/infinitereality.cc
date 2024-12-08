// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('newspaperCanvas');
const ctx = canvas.getContext('2d');

// Initialize animation parameters
let scale = 0.01;     // Controls the overall size of the tunnel elements
let depth = 0;        // Controls how far into the tunnel we've moved

// Function to make canvas responsive to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial canvas sizing and event listener for window resizing
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Arrays to store image objects and their URLs
const images = [];    // Will hold loaded Image objects
const imageURLs = [   // List of image paths for tunnel walls
    'textures/image1.jpeg',
    'textures/image4.jpeg',
    'textures/image0.jpeg',
    'textures/image3.jpeg',
    'textures/IMG_0452.JPG',
    'textures/IMG_0534.JPG',
    'textures/IMG_0553.JPG',
    'textures/Subject.jpg'
];

// Setup for the central logo
const logoImage = new Image();
const logoURL = 'textures/image2.png';

// Track image loading progress
let loadedImagesCount = 0;

// Called each time an image loads
function imageLoaded() {
    loadedImagesCount++;
    // Start animation when all images (including logo) are loaded
    if (loadedImagesCount === imageURLs.length + 1) {
        drawTunnel();
    }
}

// Load the logo image
logoImage.src = logoURL;
logoImage.onload = imageLoaded;

// Load all tunnel wall images
imageURLs.forEach(url => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        images.push(img);
        imageLoaded();
    };
});

// Logo animation parameters
let logoRotation = 0;         // Current rotation angle of the logo
let logoScale = 0.01;         // Current size of the logo
const logoScaleSpeed = 0.01;  // How quickly the logo grows
const maxLogoScale = 4;       // Maximum size the logo can reach

// Main animation function
function drawTunnel() {
    // Clear the canvas for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Setup tunnel parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numRings = 500;           // Number of circular segments in tunnel
    const ringSpacing = scale * 20; // Distance between rings
    const rotationSpeed = 0.01;     // How fast the tunnel rotates
    const texturePerRing = 10;      // Number of images per ring
    const logoRotationSpeed = -0.02; // How fast the logo spins

    // Update animation state
    depth += 2;                     // Move deeper into tunnel
    let currentScale = scale;
    logoRotation += logoRotationSpeed;
    logoScale += logoScaleSpeed;
    logoScale = Math.min(logoScale, maxLogoScale); // Prevent logo from growing too large

    // Draw the tunnel rings from back to front
    for (let i = numRings; i > 0; i--) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(depth * rotationSpeed);

        // Calculate dimensions for each image segment
        const radius = i * ringSpacing;
        const circumference = 2 * Math.PI * radius;
        const imageWidth = circumference / texturePerRing;
        const imageHeight = ringSpacing;

        // Draw images around the ring
        for (let j = 0; j < texturePerRing; j++) {
            const angle = (Math.PI * 2 / texturePerRing) * j;
            const x = Math.cos(angle) * radius - imageWidth / 2;
            const y = Math.sin(angle) * radius - imageHeight / 2;

            // Position and rotate each image segment
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.drawImage(images[j % images.length], -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
            ctx.restore();
        }

        ctx.restore();
        currentScale *= 0.95; // Reduce scale for next ring (perspective effect)
    }

    // Draw the central logo
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(logoRotation);
    ctx.scale(logoScale, logoScale);
    ctx.drawImage(logoImage, -logoImage.width / 2, -logoImage.height / 2, logoImage.width, logoImage.height);
    ctx.restore();

    // Reset tunnel scale when it gets too large
    scale += 0.005;
    if (scale > 1) scale = 0.01;

    // Continue animation loop
    requestAnimationFrame(drawTunnel);
}
