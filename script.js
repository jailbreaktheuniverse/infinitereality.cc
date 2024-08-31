document.addEventListener("DOMContentLoaded", function() {
    const userAgent = navigator.userAgent;
    const eInkUserAgents = ['EinkBro', 'Silk'];
    const isEinkDevice = eInkUserAgents.some(agent => userAgent.includes(agent));

    if (isEinkDevice) {
        document.body.classList.add('eink-mode');
        return;
    }

    const sections = document.querySelectorAll('section');
    const apiUrl = 'https://api.github.com/repos/jailbreaktheuniverse/infinitereality.cc/contents/art';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const images = data.filter(file => /\.(jpe?g)$/i.test(file.name)).map(file => file.download_url);

            if (images.length === 0) {
                console.error('No images found in the repository');
                return;
            }

            sections.forEach(section => {
                const imageContainer = section.querySelector('.background-image-container');
                if (!imageContainer) {
                    console.error('No background-image-container found in the section');
                    return;
                }
                const randomImage = images[Math.floor(Math.random() * images.length)];
                imageContainer.style.backgroundImage = `url(${randomImage})`;
                imageContainer.classList.add('image-adjust');
                section.querySelector('.content').classList.add('frosted-glass'); // Add frosted glass effect to content
            });
        })
        .catch(error => {
            console.error('Error loading images:', error);
        });
});
