
const canvas = document.getElementById('newspaperCanvas');
const ctx = canvas.getContext('2d');

let tiltX = 0; // Tilt left/right (gamma)
let tiltY = 0; // Tilt forward/backward (beta)

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Listen to device orientation changes
window.addEventListener('deviceorientation', (event) => {
    // Gamma is the left to right tilt in degrees, where right is positive
    tiltX = event.gamma;
    // Beta is the front to back tilt in degrees, where front is positive
    tiltY = event.beta;
});

let angle = 0;
let scale = 0.1;
let pieces = 1;
const images = [];
const imageURLs = ['textures/image1.jpeg', 'textures/image4.jpeg', 'textures/image0.jpeg', 'textures/image3.jpeg','textures/image5.jpeg'];
const logoImage = new Image();
const logoURL = 'textures/image2.jpeg';

let loadedImagesCount = 0;

function imageLoaded() {
    loadedImagesCount++;
    if (loadedImagesCount === imageURLs.length + 1) {
        drawNewspaper();
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


function drawNewspaper() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply tilt based on device orientation
    ctx.rotate(tiltX * Math.PI / 180);
    ctx.rotate(tiltY * Math.PI / 180);

    ctx.scale(scale, scale);
    ctx.rotate(angle);

    // Draw the main spinning newspaper (logo) with its specific image
    ctx.drawImage(logoImage, -50, -50, 100, 100);

    ctx.restore();

    angle += 0.2; // Increased spin speed
    scale += 0.01;

    if (scale > 4) {
        scale = 0.1; // Reset scale
        // Increase pieces more rapidly to simulate fractal disintegration
        // Adjust the multiplier (e.g., 4 to 8) to control the increase rate
        pieces += 8; // Increase this value for more fragments
    }

    for (let i = 0; i < pieces && i < images.length; i++) {
        ctx.save();
        let distance = 50 + i * 10;
        let angleOffset = i * (Math.PI * 2 / pieces);
        ctx.translate(canvas.width / 2 + distance * Math.cos(angle + angleOffset), canvas.height / 2 + distance * Math.sin(angle + angleOffset));
        ctx.scale(0.2, 0.2); // You might want to adjust this scale for visual appeal
        ctx.rotate(Math.random() * 2 * Math.PI);
        ctx.drawImage(images[i % images.length], -50, -50, 100, 100);
        ctx.restore();
    }

    requestAnimationFrame(drawNewspaper);
}
