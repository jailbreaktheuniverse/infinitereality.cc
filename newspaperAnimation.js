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
const imageURLs = ['textures/image1.jpeg', 'textures/image4.jpeg', 'textures/image0.jpeg', 'textures/image3.jpeg','textures/image5.jpeg']; // Add your fractal piece image URLs here
const logoImage = new Image(); // Image for the logo
const logoURL = 'textures/image2.jpeg'; // URL for the logo image

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

    angle += 0.2; // Increased spin speed
    scale += 0.01;

    // Assuming the maximum scale is when the logo's size is about the size of the canvas
    // This threshold can be adjusted based on the desired "maximum" size
    let maxScaleThreshold = Math.min(canvas.width, canvas.height) / 100; // Example threshold

    if (scale > maxScaleThreshold) {
        window.location.href = '/infinitereality.html'; // Redirect
        return; // Stop the animation loop
    }

    if (scale > 2) {
        scale = 0.1; // Reset scale
        pieces += 2; // Increase pieces more rapidly to simulate fractal disintegration
    }

    // Draw fractal disintegration pieces with different images as textures
    for (let i = 0; i < pieces && i < images.length; i++) {
        ctx.save();
        let distance = 50 + i * 10; // Increase distance from center based on the piece index
        let angleOffset = i * (Math.PI * 2 / pieces);
        ctx.translate(canvas.width / 2 + distance * Math.cos(angle + angleOffset), canvas.height / 2 + distance * Math.sin(angle + angleOffset));
        ctx.scale(0.2, 0.2); // Increased size of pieces
        ctx.rotate(Math.random() * 2 * Math.PI);
        ctx.drawImage(images[i % images.length], -50, -50, 100, 100);
        ctx.restore();
    }

    requestAnimationFrame(drawNewspaper);
}
