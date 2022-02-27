(function () {
    arctiumInit.onBodyLoaded(onBodyLoaded);

    var bgAnimationTime = 40 * 1000;
    var bgImage, homeEl;
    var currentHue = 135;

    function onBodyLoaded() {
        bgImage = document.getElementsByClassName('background-image')[0];
        homeEl = document.getElementById('home');

        setTimeout(() => {
                animateBackground();
                setInterval(animateBackground, bgAnimationTime);
        }, 100);

        initNavButtons();
    }

    function initNavButtons() {
        var nav = document.querySelector('.home .nav');
        nav.addEventListener('click', onNavClick);
    }

    function onNavClick(e) {
        if (!e.target.closest('.a-spa')) {
            return;
        };

        e.preventDefault();
        var pageName = e.target.getAttribute('href');

        homeEl.classList.add('home-fade-out');
        setTimeout(() => homeEl.style = 'display: none', 200);
        setTimeout(() => showPage(pageName), 201);
    }

    function showPage(pageName) {
        if (pageName === '/documentation') {
            documentation.show();
        }
    }

    function animateBackground() {
        var newScale = 1 + (Math.floor(Math.random() * 3) / 10);
        var newX = -Math.floor((Math.random() * 50));
        var newY = -Math.floor((Math.random() * 50));
        var newHue = (currentHue + Math.floor(Math.random() * 30)) % 360;
        var newContrast = 100 + Math.floor(Math.random() * 10);

        var style = `transform: translate(${newX}px, ${newY}px) scale(${newScale});`;
        style += `filter: hue-rotate(${newHue}deg) contrast(${newContrast}%);`;

        bgImage.style = style;
    }
})();