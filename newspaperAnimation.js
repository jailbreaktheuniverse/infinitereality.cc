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

function drawTunnel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numRings = 100; // Number of rings to simulate depth
    const tunnelDepth = 1000; // Depth of the tunnel
    const fov = Math.PI / 4; // Field of view
    const viewDistance = (canvas.width / 2) / Math.tan(fov / 2); // Distance from viewer to screen

    let z = 0; // Depth position of each ring

    for (let i = 0; i < numRings; i++) {
        const ringDistance = i * (tunnelDepth / numRings);
        const nextRingDistance = (i + 1) * (tunnelDepth / numRings);
        const ringRadius = (canvas.width / 2) * (ringDistance / viewDistance);
        const nextRingRadius = (canvas.width / 2) * (nextRingDistance / viewDistance);

        // Calculate the angle step to keep the texture mapping consistent
        const texturePerRing = 20;
        const angleStep = (Math.PI * 2) / texturePerRing;

        for (let j = 0; j < texturePerRing; j++) {
            const angle = j * angleStep;
            const nextAngle = (j + 1) * angleStep;

            // Calculate the four points of the current segment
            const x1 = centerX + Math.cos(angle) * ringRadius;
            const y1 = centerY + Math.sin(angle) * ringRadius;
            const x2 = centerX + Math.cos(nextAngle) * ringRadius;
            const y2 = centerY + Math.sin(nextAngle) * ringRadius;
            const x3 = centerX + Math.cos(nextAngle) * nextRingRadius;
            const y3 = centerY + Math.sin(nextAngle) * nextRingRadius;
            const x4 = centerX + Math.cos(angle) * nextRingRadius;
            const y4 = centerY + Math.sin(angle) * nextRingRadius;

            // Draw the segment
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();

            // Texture mapping or color
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Placeholder for texture or color
            ctx.fill();
        }
    }

    requestAnimationFrame(drawTunnel);
}


