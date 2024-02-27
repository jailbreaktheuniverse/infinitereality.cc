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

    const tunnelRadius = canvas.height / 2 * scale; // Radius of the tunnel
    const slices = images.length; // Number of slices to divide the tunnel into
    const depthPerSlice = 100; // Depth of each slice
    const rotationSpeed = 0.01; // Speed of rotation

    depth += 2; // Move through the tunnel
    if (depth > depthPerSlice) depth -= depthPerSlice; // Loop the depth to simulate infinite tunnel

    for (let i = 0; i < slices; i++) {
        ctx.save();
        // Calculate slice angle and position
        const sliceAngle = (Math.PI * 2) / slices;
        const angle = sliceAngle * i + depth * rotationSpeed; // Add rotation based on depth

        // Calculate the slice's position on the canvas
        const x = canvas.width / 2 + Math.cos(angle) * tunnelRadius;
        const y = canvas.height / 2 + Math.sin(angle) * tunnelRadius;

        // Adjust the context to draw the slice
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2); // Rotate to align with the tunnel's curvature

        // Tile the image along the depth of the tunnel
        for (let j = -depth; j < canvas.height * scale; j += depthPerSlice) {
            ctx.drawImage(images[i % images.length], -canvas.width / (slices * 2), j, canvas.width / slices, depthPerSlice);
        }

        ctx.restore();
    }

    // Draw the end of the tunnel
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.drawImage(logoImage, -logoImage.width / 2, -logoImage.height / 2, logoImage.width, logoImage.height);
    ctx.restore();

    // Update scale for the animation
    scale += 0.005;
    if (scale > 1) scale = 0.01; // Reset scale to loop the effect

    requestAnimationFrame(drawTunnel);
}

