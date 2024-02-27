
const canvas = document.getElementById('newspaperCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas(); // Initial resize
window.addEventListener('resize', resizeCanvas); // Resize when window size changes

let angle = 0;
let scale = 0.1;
let pieces = 1;
const images = []; // Array to hold fractal piece images
const imageURLs = ['textures/image1.jpg', 'textures/image4.jpg', 'textures/image0.jpg', 'textures/image3.jpg','textures/image5.jpg']; // Add your fractal piece image URLs here
const logoImage = new Image(); // Image for the logo
const logoURL = 'textures/image2.jpg'; // URL for the logo image

let loadedImagesCount = 0; // Counter for loaded images

function imageLoaded() {
    loadedImagesCount++;
    if (loadedImagesCount === imageURLs.length + 1) { // +1 for the logo image
        drawNewspaper(); // Start drawing when all images are loaded
    }
}

// Load logo image
logoImage.src = logoURL;
logoImage.onload = imageLoaded;

// Load fractal piece images and store them in the images array
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
    ctx.scale(scale, scale);
    ctx.rotate(angle);

    // Draw the main spinning newspaper (logo) with its specific image
    ctx.drawImage(logoImage, -50, -50, 100, 100);

    ctx.restore();

    angle += 0.1;
    scale += 0.01;

    if (scale > 2) {
        scale = 0.1; // Reset scale
        pieces++; // Increase pieces to simulate fractal disintegration
    }

    // Draw fractal disintegration pieces with different images as textures
    for (let i = 0; i < pieces && i < images.length; i++) {
        ctx.save();
        ctx.translate((Math.random() - 0.5) * canvas.width, (Math.random() - 0.5) * canvas.height);
        ctx.scale(0.1, 0.1); // Smaller pieces
        ctx.rotate(Math.random() * 2 * Math.PI);
        ctx.drawImage(images[i % images.length], -50, -50, 100, 100);
        ctx.restore();
    }

    requestAnimationFrame(drawNewspaper);
}

