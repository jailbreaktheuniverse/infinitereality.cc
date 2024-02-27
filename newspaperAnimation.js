const canvas = document.getElementById('newspaperCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const images = [];
const imageURLs = [
    'textures/image1.jpeg',
    'textures/image4.jpeg',
    'textures/image0.jpeg',
    'textures/image3.jpeg',
    'textures/image5.jpeg'
];
const logoImage = new Image();
const logoURL = 'textures/image2.png';

let loadedImagesCount = 0;

function imageLoaded() {
    loadedImagesCount++;
    if (loadedImagesCount === imageURLs.length + 1) {
        requestAnimationFrame(drawTunnel);
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
    const numRings = 50; // Reduced for performance
    const tunnelDepth = 1000;
    const fov = Math.PI / 4;
    const viewDistance = (canvas.width / 2) / Math.tan(fov / 2);

    const tunnelRotationSpeed = 0.0001;
    let tunnelRotation = performance.now() * tunnelRotationSpeed;

    const logoRotationSpeed = -0.01;
    logoRotation += logoRotationSpeed;

    for (let i = 0; i < numRings; i++) {
        const ringDistance = i * (tunnelDepth / numRings);
        const nextRingDistance = (i + 1) * (tunnelDepth / numRings);
        const ringRadius = (canvas.width / 2) * (ringDistance / viewDistance);
        const nextRingRadius = (canvas.width / 2) * (nextRingDistance / viewDistance);

        const texturePerRing = images.length;
        const angleStep = (Math.PI * 2) / texturePerRing;

        for (let j = 0; j < texturePerRing; j++) {
            const angle = j * angleStep + tunnelRotation;
            const nextAngle = (j + 1) * angleStep + tunnelRotation;

            const img = images[j % images.length];
            drawSegment(centerX, centerY, angle, nextAngle, ringRadius, nextRingRadius, img);
        }
    }

    // Draw rotating logo at the end of the tunnel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(logoRotation);
    ctx.drawImage(logoImage, -logoImage.width / 2, -logoImage.height / 2, logoImage.width, logoImage.height);
    ctx.restore();

    requestAnimationFrame(drawTunnel);
}

function drawSegment(centerX, centerY, angle, nextAngle, innerRadius, outerRadius, img) {
    const x1 = centerX + Math.cos(angle) * innerRadius;
    const y1 = centerY + Math.sin(angle) * innerRadius;
    const x2 = centerX + Math.cos(nextAngle) * innerRadius;
    const y2 = centerY + Math.sin(nextAngle) * innerRadius;
    const x3 = centerX + Math.cos(nextAngle) * outerRadius;
    const y3 = centerY + Math.sin(nextAngle) * outerRadius;
    const x4 = centerX + Math.cos(angle) * outerRadius;
    const y4 = centerY + Math.sin(angle) * outerRadius;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();

    // Create a pattern and apply it as fill style
    const pattern = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = pattern;

    // Save the context state
    ctx.save();

    // Create a clipping path to restrict the pattern within the segment
    ctx.clip();

    // Translate and rotate to align the pattern with the segment
    const segmentCenterX = (x1 + x2 + x3 + x4) / 4;
    const segmentCenterY = (y1 + y2 + y3 + y4) / 4;
    const segmentCenterY = (y1 + y2 + y3 + y4) / 4;
        ctx.translate(segmentCenterX, segmentCenterY);
        ctx.rotate(angle + Math.PI / 2);

        // Fill the segment with the pattern
        // Adjust the pattern size and position as needed
        ctx.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);

        // Restore the context state
        ctx.restore();
    }

    requestAnimationFrame(drawTunnel);
