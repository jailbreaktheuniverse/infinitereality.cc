document.addEventListener("DOMContentLoaded", function() {
    const userAgent = navigator.userAgent;
    const eInkUserAgents = ['EinkBro', 'Silk'];
    const isEinkDevice = eInkUserAgents.some(agent => userAgent.includes(agent));

    if (isEinkDevice) {
        document.body.classList.add('eink-mode');
    } else {
        // Load background images if not an eInk device
        const sections = document.querySelectorAll('section');
        const apiUrl = 'https://api.github.com/repos/jailbreaktheuniverse/infinitereality.cc/contents/art';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const images = data.filter(file => /\.(jpe?g)$/i.test(file.name)).map(file => file.download_url);
                sections.forEach((section, index) => {
                    const randomImage = images[Math.floor(Math.random() * images.length)];
                    section.style.backgroundImage = `url(${randomImage})`;
                    section.classList.add('glass-effect', 'image-adjust'); // Apply CSS classes
                    section.style.backgroundRepeat = 'no-repeat';
                    section.style.backgroundSize = 'cover';
                });
            })
            .catch(error => console.error('Error loading images:', error));
    }
});
