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

window.addEventListener('deviceorientation', (event) => {
    tiltX = event.gamma;
    tiltY = event.beta;
});

let angle = 0;
let scale = 1; // Start with a scale of 1
let pieces = 1;
const images = [];
const imageURLs = ['textures/image1.jpeg', 'textures/image4.jpeg', 'textures/image0.jpeg', 'textures/image3.jpeg','textures/image5.jpeg'];
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tunnel walls
    for (let i = 0; i < images.length; i++) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + i * (Math.PI * 2 / images.length));
        ctx.scale(scale, scale);
        ctx.drawImage(images[i], -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();
    }

    // Draw the end of the tunnel
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale * 0.1, scale * 0.1); // Scale down the logo to simulate the end of the tunnel
    ctx.drawImage(logoImage, -logoImage.width / 2, -logoImage.height / 2);
    ctx.restore();

    angle += 0.01; // Rotate the tunnel
    scale *= 0.99; // Decrease scale to simulate zooming in
    if (scale < 0.1) {
        scale = 1; // Reset scale when it gets too small
    }

    requestAnimationFrame(drawTunnel);
}
