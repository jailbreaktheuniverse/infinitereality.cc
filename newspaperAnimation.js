
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
const logoURL = 'textures/image2.png';

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
    // Clear the canvas with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Fully transparent
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(tiltX * Math.PI / 180);
    ctx.rotate(tiltY * Math.PI / 180);
    ctx.scale(scale, scale);
    ctx.rotate(angle);

    // Set globalCompositeOperation to 'copy' for direct copy without alpha blending
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(logoImage, -50, -50, 100, 100);
    // Reset globalCompositeOperation to default
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();

    angle += 0.2;
    scale += 0.01;
    if (scale > 8) {
        scale = 0.1;
        pieces += 8;
    }

    for (let i = 0; i < pieces && i < images.length; i++) {
        ctx.save();
        let distance = 300 + i * 50;
        let angleOffset = i * (Math.PI * 2 / pieces);
        ctx.translate(canvas.width / 2 + distance * Math.cos(angle + angleOffset), canvas.height / 2 + distance * Math.sin(angle + angleOffset));
        ctx.scale(0.5, 0.5);
        ctx.rotate(Math.random() * 2 * Math.PI);
        ctx.drawImage(images[i % images.length], -50, -50, 100, 100);
        ctx.restore();
    }

    requestAnimationFrame(drawNewspaper);
}


