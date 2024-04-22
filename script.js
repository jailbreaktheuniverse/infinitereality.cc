document.addEventListener("DOMContentLoaded", function() {
    // Detect the user agent to identify eInk devices
    const userAgent = navigator.userAgent;
    const eInkUserAgents = ['EinkBro', 'Silk'];
    const isEinkDevice = eInkUserAgents.some(agent => userAgent.includes(agent));

    // If the device is an eInk device, apply the eInk mode
    if (isEinkDevice) {
        document.body.classList.add('eink-mode');
    } else {
        // Select all section elements to apply background images
        const sections = document.querySelectorAll('section');

        // Define the API URL that returns the list of images
        const apiUrl = 'https://api.github.com/repos/jailbreaktheuniverse/infinitereality.cc/contents/art';

        // Fetch the data from the API
        fetch(apiUrl)
            .then(response => {
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse JSON data from the response
            })
            .then(data => {
                // Filter the data to get only JPEG images and map to their download URLs
                const images = data.filter(file => /\.(jpe?g)$/i.test(file.name)).map(file => file.download_url);

                // Check if there are any images to use
                if (images.length === 0) {
                    console.error('No images found in the repository');
                    return;
                }

                // Apply a random image to each section's background-image-container
                sections.forEach(section => {
                    const imageContainer = section.querySelector('.background-image-container');
                    if (!imageContainer) {
                        console.error('No background-image-container found in the section');
                        return;
                    }
                    const randomImage = images[Math.floor(Math.random() * images.length)];
                    imageContainer.style.backgroundImage = `url(${randomImage})`;
                    imageContainer.classList.add('image-adjust'); // Apply image adjustment styles
                    imageContainer.style.backgroundRepeat = 'no-repeat';
                    imageContainer.style.backgroundSize = 'cover';
                });
            })
            .catch(error => {
                // Log any errors that occur during the fetch operation
                console.error('Error loading images:', error);
            });
    }
});
