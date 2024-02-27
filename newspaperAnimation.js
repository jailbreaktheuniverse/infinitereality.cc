function drawTunnel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numRings = 100;
    const tunnelDepth = 1000;
    const fov = Math.PI / 4;
    const viewDistance = (canvas.width / 2) / Math.tan(fov / 2);

    const tunnelRotationSpeed = 0.01;
    let tunnelRotation = performance.now() * tunnelRotationSpeed;

    const logoRotationSpeed = -0.02;
    logoRotation += logoRotationSpeed;

    for (let i = 0; i < numRings; i++) {
        const ringDistance = i * (tunnelDepth / numRings);
        const nextRingDistance = (i + 1) * (tunnelDepth / numRings);
        const ringRadius = (canvas.width / 2) * (ringDistance / viewDistance);
        const nextRingRadius = (canvas.width / 2) * (nextRingDistance / viewDistance);

        const texturePerRing = images.length; // Use the number of loaded images for texture mapping
        const angleStep = (Math.PI * 2) / texturePerRing;

        for (let j = 0; j < texturePerRing; j++) {
            const angle = j * angleStep + tunnelRotation;
            const nextAngle = (j + 1) * angleStep + tunnelRotation;

            const x1 = centerX + Math.cos(angle) * ringRadius;
            const y1 = centerY + Math.sin(angle) * ringRadius;
            const x2 = centerX + Math.cos(nextAngle) * ringRadius;
            const y2 = centerY + Math.sin(nextAngle) * ringRadius;
            const x3 = centerX + Math.cos(nextAngle) * nextRingRadius;
            const y3 = centerY + Math.sin(nextAngle) * nextRingRadius;
            const x4 = centerX + Math.cos(angle) * nextRingRadius;
            const y4 = centerY + Math.sin(angle) * nextRingRadius;

            // Choose an image based on the current segment
            const img = images[j % images.length];

            // Draw the image segment
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();
            ctx.clip();

            // Calculate the image's drawing dimensions
            const imgWidth = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const imgHeight = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2);
            const centerX = (x1 + x2 + x3 + x4) / 4;
            const centerY = (y1 + y2 + y3 + y4) / 4;

            ctx.translate(centerX, centerY);
            ctx.rotate(angle + Math.PI / 2);
            ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

            ctx.restore();
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
