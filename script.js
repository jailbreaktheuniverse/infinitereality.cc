document.addEventListener("DOMContentLoaded", function() {
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
});
