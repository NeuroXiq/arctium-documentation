arctium.global.spaRouting=(function() {
    var routesCfg=[];
    var onRouteChangeCompletedCallbacks=[];
    var currentRoute;

    function initRoutes(routesConfig) {
        routesCfg=routesConfig;

        window.addEventListener('popstate',onWindowPopState);
        document.body.addEventListener('click',handleIfLinkClick);
        currentRoute=window.location.pathname;

        changeVisiblePage(currentRoute);
    }

    function onWindowPopState(e) {
        e.preventDefault();
        changeVisiblePage(e.state);
    }

    function handleIfLinkClick(e) {
        let linkEl=e.target.closest('.spa-route');

        if(!linkEl) {
            return;
        }

        e.preventDefault();

        if(linkEl.classList.contains('spa-route')) {
            let newPage=linkEl.getAttribute('href');

            changeVisiblePage(newPage);
        }
    }

    function setCurrentRoute(newPage,url) {
        window.history.pushState(newPage,null,newPage);
        currentRoute=newPage;
    }

    function changeVisiblePage(newRoute) {
        let newRouteCfg=routesCfg.find(routeCfg => routeCfg.route===newRoute);
        let currentRouteCfg=routesCfg.find(routeCfg => routeCfg.route == currentRoute);

        if(!newRouteCfg||!currentRouteCfg) {
            throw new Error('Route or current route not found in configuration: ' + newRoute);
        }

        let newEl=newRouteCfg.element;
        let curEl=currentRouteCfg.element;
        let fadeout='spa-routing-fade-out';
        let cssTransitionTime=100;

        curEl.classList.add(fadeout);
        newEl.classList.add(fadeout);

        setTimeout(() => {
            curEl.classList.add('hide');
            newEl.classList.remove('hide');
            newEl.classList.remove(fadeout);
        },cssTransitionTime);

        setCurrentRoute(newRouteCfg.route);
        onRouteChangeCompletedCallbacks.forEach(callback => callback({
            newRoute: newRouteCfg.route
        }));
    }

    function onRouteChangeCompleted(callback) {
        onRouteChangeCompletedCallbacks.push(callback);
    }

    return {
        initRoutes: initRoutes,
        onRouteChangeCompleted: onRouteChangeCompleted
    };
})();