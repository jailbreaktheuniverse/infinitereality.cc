const canvas = document.getElementById('newspaperCanvas');
const ctx = canvas.getContext('2d');

let scale = 0.01; // Initial scale for the tunnel effect
let depth = 0; // Depth into the tunnel

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const images = [];
const imageURLs = ['textures/image1.jpeg', 'textures/image4.jpeg', 'textures/image0.jpeg', 'textures/image3.jpeg', 'textures/image5.jpeg'];
const logoImage = new Image();
const logoURL = 'textures/image2.png';

let loadedImagesCount = 0;

function imageLoaded() {
    loadedImagesCount++;
    if (loadedImagesCount === imageURLs.length + 1) {
        drawTunnel();
    }
}

logoImage.src = logoURL;
logoImage.onload = imageLoaded;

imageURLs.forEach(url => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        images.push(img);
        imageLoaded();
    };
});

let logoRotation = 0; // Initialize logo rotation variable

function drawTunnel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numRings = 50; // Number of concentric rings to simulate depth
    const ringSpacing = scale * 20; // Spacing between rings to simulate depth
    const rotationSpeed = 0.01; // Speed of rotation for the tunnel
    const texturePerRing = 10; // Number of times the texture repeats around each ring
    const logoRotationSpeed = -0.02; // Speed of rotation for the logo, negative for opposite direction

    depth += 2; // Move through the tunnel
    let currentScale = scale;
    logoRotation += logoRotationSpeed; // Update logo rotation

    for (let i = numRings; i > 0; i--) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(depth * rotationSpeed); // Rotate the tunnel

        const radius = i * ringSpacing;
        const circumference = 2 * Math.PI * radius;
        const imageWidth = circumference / texturePerRing;
        const imageHeight = ringSpacing;

        for (let j = 0; j < texturePerRing; j++) {
            const angle = (Math.PI * 2 / texturePerRing) * j;
            const x = Math.cos(angle) * radius - imageWidth / 2;
            const y = Math.sin(angle) * radius - imageHeight / 2;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2); // Align texture with the ring
            ctx.drawImage(images[j % images.length], -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
            ctx.restore();
        }

        ctx.restore();
        currentScale *= 0.95; // Decrease scale for next ring to simulate depth
    }

    // Draw the rotating logo at the end of the tunnel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(logoRotation); // Apply the independent logo rotation
    ctx.drawImage(logoImage, -logoImage.width / 2, -logoImage.height / 2, logoImage.width, logoImage.height);
    ctx.restore();

    // Update scale for the animation
    scale += 0.005;
    if (scale > 1) scale = 0.01; // Reset scale to loop the effect

    requestAnimationFrame(drawTunnel);
}
