document.addEventListener("DOMContentLoaded", function() {
    const userAgent = navigator.userAgent;
    const eInkUserAgents = ['EinkBro', 'Silk'];
    const isEinkDevice = eInkUserAgents.some(agent => userAgent.includes(agent));

    if (isEinkDevice) {
        document.body.classList.add('eink-mode');
    } else {
        const sections = document.querySelectorAll('section');
        const apiUrl = 'https://api.github.com/repos/jailbreaktheuniverse/infinitereality.cc/contents/art';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const images = data.filter(file => /\.(jpe?g)$/i.test(file.name)).map(file => file.download_url);
                sections.forEach((section, index) => {
                    const imageContainer = section.querySelector('.background-image-container');
                    const randomImage = images[Math.floor(Math.random() * images.length)];
                    imageContainer.style.backgroundImage = `url(${randomImage})`;
                    imageContainer.classList.add('image-adjust');
                    imageContainer.style.backgroundRepeat = 'no-repeat';
                    imageContainer.style.backgroundSize = 'cover';
                });
            })
            .catch(error => console.error('Error loading images:', error));
    }
});
