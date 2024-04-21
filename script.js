document.addEventListener("DOMContentLoaded", function() {
    const userAgent = navigator.userAgent;

    // List of eInk device user agents or keywords
    const eInkUserAgents = ['EinkBro', 'Silk'];

    // Check if the current device's user agent matches any in the list
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
                sections.forEach(section => {
                    const randomImage = images[Math.floor(Math.random() * images.length)];
                    section.style.backgroundImage = `url(${randomImage})`;
                    section.style.backgroundRepeat = 'repeat';
                });
            })
            .catch(error => console.error('Error loading images:', error));
    }
});
