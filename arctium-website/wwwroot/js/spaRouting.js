arctium.global.spaRouting=(function() {
    var routesCfg=[];

    function initRoutes(routesConfig) {
        routesCfg=routesConfig;

        document.body.addEventListener('click',handleIfLinkClick);
    }

    function handleIfLinkClick(e) {
        let linkEl=e.target.closest('.spa-route,.spa-route-back');

        if(!linkEl) {
            return;
        }

        e.preventDefault();

        let newPage=linkEl.getAttribute('href');

        changePage(newPage);
    }

    function changePage(newRoute) {
        let newRouteCfg=routesCfg.find(routeCfg => routeCfg.route===newRoute);
        let currentRouteCfg=routesCfg.find(routeCfg => window.location.pathname.startsWith(routeCfg.route));

        if(!newRouteCfg||!currentRouteCfg) {
            throw new Error('Route or current route not found in configuration: ' + newRoute);
        }

        window.history.pushState('','',newRouteCfg.route);

        let newEl=newRouteCfg.element;
        let curEl=currentRouteCfg.element;
        let fadeout='spa-routing-fade-out';
        
        curEl.classList.add(fadeout);
        newEl.classList.add(fadeout);

        setTimeout(() => {
            curEl.classList.add('hide');
            newEl.classList.remove('hide');
            newEl.classList.remove(fadeout);
        },200);
    }

    function goBack() {
        console.log('bac');
    }

    return {
        initRoutes: initRoutes,
        goBack: goBack
    };
})();