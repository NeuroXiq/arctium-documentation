(function() {
    arctiumInit.onBodyLoaded(onBodyLoaded);

    var bgAnimationTime = 40 * 1000;
    var bgImage, homeEl;
    var currentHue = 135;

    function onBodyLoaded() {
        bgImage = document.getElementsByClassName('background-image')[0];
        homeEl=document.getElementById('home');


        setTimeout(() => {
                animateBackground();
                setInterval(animateBackground, bgAnimationTime);
        }, 100);

        //initNavButtons();
        initSpaRouting();
    }

    function initSpaRouting() {

        var routesConfig=[
            {
                route: '/',
                element: document.querySelector('.home-page-wrapper-spa'),
            },
            {
                route: '/documentation',
                element: document.querySelector('.documentation-page-wrapper-spa'),
                canHaveParams: true,
                elementInstance: documentation
            },
            {
                route: '/online-tools',
                element: document.querySelector('.online-tools-page-wrapper-spa')
            },
            {
                route: '/forum',
                element: document.querySelector('.forum-page-wrapper-spa')
            },
        ]

        arctium.global.spaRouting.initRoutes(routesConfig);
    }

    function animateBackground() {
        var newScale = 1 + (Math.floor(Math.random() * 3) / 10);
        var newX = -Math.floor((Math.random() * 50));
        var newY = -Math.floor((Math.random() * 50));
        var newHue = (currentHue + Math.floor(Math.random() * 90)) % 360;
        var newContrast = 100 + Math.floor(Math.random() * 10);

        var style = `transform: translate(${newX}px, ${newY}px) scale(${newScale});`;
        style += `filter: hue-rotate(${newHue}deg) contrast(${newContrast}%);`;

        bgImage.style = style;
    }
})();