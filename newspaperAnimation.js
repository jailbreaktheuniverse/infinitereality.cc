const canvas = document.getElementById('newspaperCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let angle = 0;
let scale = 0.1;
const images = [];
const imageURLs = ['textures/image1.jpeg', 'textures/image4.jpeg', 'textures/image0.jpeg', 'textures/image3.jpeg', 'textures/image5.jpeg'];
const logoImage = new Image();
const logoURL = 'textures/image2.jpeg';

let loadedImagesCount = 0;

function imageLoaded() {
    loadedImagesCount++;
    if (loadedImagesCount === imageURLs.length + 1) {
        drawNewspaper();
        setTimeout(() => {
            window.location.assign('/infinitereality.html');
        }, 5000);
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

    let zScale = 0.1 + Math.abs(Math.sin(angle)) * 0.9; // Simulate Z-axis spin
    ctx.scale(zScale, zScale);
    ctx.rotate(angle);

    ctx.drawImage(logoImage, -50, -50, 100, 100);

    ctx.restore();

    angle += 0.05; // Control the speed of rotation

    requestAnimationFrame(drawNewspaper);
}
