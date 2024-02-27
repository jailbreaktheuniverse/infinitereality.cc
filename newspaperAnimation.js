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

let logoRotation = 0; // Initialize logo rotation

function drawTunnel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numRings = 100;
    const tunnelDepth = 1000;
    const fov = Math.PI / 4;
    const viewDistance = (canvas.width / 2) / Math.tan(fov / 2);

    // Tunnel rotation (for demonstration, adjust as needed)
    const tunnelRotationSpeed = 0.01;
    let tunnelRotation = performance.now() * tunnelRotationSpeed;

    // Logo rotation speed (opposite direction, adjust magnitude as needed)
    const logoRotationSpeed = -0.02;
    logoRotation += logoRotationSpeed;

    for (let i = 0; i < numRings; i++) {
        const ringDistance = i * (tunnelDepth / numRings);
        const nextRingDistance = (i + 1) * (tunnelDepth / numRings);
        const ringRadius = (canvas.width / 2) * (ringDistance / viewDistance);
        const nextRingRadius = (canvas.width / 2) * (nextRingDistance / viewDistance);

        const texturePerRing = 20;
        const angleStep = (Math.PI * 2) / texturePerRing;

        for (let j = 0; j < texturePerRing; j++) {
            const angle = j * angleStep + tunnelRotation; // Apply tunnel rotation
            const nextAngle = (j + 1) * angleStep + tunnelRotation;

            const x1 = centerX + Math.cos(angle) * ringRadius;
            const y1 = centerY + Math.sin(angle) * ringRadius;
            const x2 = centerX + Math.cos(nextAngle) * ringRadius;
            const y2 = centerY + Math.sin(nextAngle) * ringRadius;
            const x3 = centerX + Math.cos(nextAngle) * nextRingRadius;
            const y3 = centerY + Math.sin(nextAngle) * nextRingRadius;
            const x4 = centerX + Math.cos(angle) * nextRingRadius;
            const y4 = centerY + Math.sin(angle) * nextRingRadius;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    }

    // Draw rotating logo at the end of the tunnel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(logoRotation); // Apply logo rotation
    ctx.drawImage(logoImage, -logoImage.width / 2, -logoImage.height / 2, logoImage.width, logoImage.height);
    ctx.restore();

    requestAnimationFrame(drawTunnel);
}


