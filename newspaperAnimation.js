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
const imageURLs = ['textures/image1.jpeg', 'textures/image4.jpeg', 'textures/image0.jpeg', 'textures/image3.jpeg', 'textures/IMG_0452.JPG', 'textures/IMG_0534.JPG', 'textures/IMG_0553.JPG', 'textures/Subject.jpg'];
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
let logoScale = 0.01; // Initial scale for the logo
const logoScaleSpeed = 0.01; // Speed at which the logo scale increases
const maxLogoScale = 5; // Maximum scale for the logo, adjust as needed to fill the screen

function drawTunnel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numRings = 100; //changed to 100
    const ringSpacing = scale * 20;
    const rotationSpeed = 0.01;
    const texturePerRing = 10;
    const logoRotationSpeed = -0.02;

    depth += 2;
    let currentScale = scale;
    logoRotation += logoRotationSpeed;
    logoScale += logoScaleSpeed; // Update logo scale
    if (logoScale > maxLogoScale) logoScale = maxLogoScale; // Cap the logo scale at its maximum value

    for (let i = numRings; i > 0; i--) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(depth * rotationSpeed);

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
            ctx.rotate(angle + Math.PI / 2);
            ctx.drawImage(images[j % images.length], -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
            ctx.restore();
        }

        ctx.restore();
        currentScale *= 0.95;
    }

    // Draw the rotating and scaling logo at the end of the tunnel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(logoRotation);
    // Apply the dynamic scale to the logo
    ctx.scale(logoScale, logoScale);
    ctx.drawImage(logoImage, -logoImage.width / 2, -logoImage.height / 2, logoImage.width, logoImage.height);
    ctx.restore();

    scale += 0.005;
    if (scale > 1) scale = 0.01;

    requestAnimationFrame(drawTunnel);
}

