arctium.global.spaRouting=(function() {
    var routesCfg=[];
    var currentPageFullPath;
    var spaPageNotFoundEl;

    function initRoutes(routesConfig) {
        routesCfg=routesConfig;
        spaPageNotFoundEl=document.getElementById('spa-page-not-found');
        spaPageNotFoundEl.querySelector('.home-button').addEventListener('click',onSpaPageNotFoundHomeButtonClick);

        window.addEventListener('popstate',onWindowPopState);
        document.body.addEventListener('click',handleIfLinkClick);
        changeVisiblePage(window.location.pathname);
    }

    function onWindowPopState(e) {
        changeVisiblePage(window.location.pathname);
    }

    function getBestRouteMatch(newRoute) {
        newRoute=newRoute||'';
        let ordered=routesCfg.sort((a,b) => a.route.length-b.route.length);
        let result={};
        let found=false;
        ordered.reverse();

        for(let i=0;i<ordered.length;i++) {
            if(newRoute.startsWith(ordered[i].route)&&ordered[i].route.length <= newRoute.length) {
                return ordered[i];

                // if(ordered[i].route===newRoute) {
                //     result.hasParams=false;
                //     result.params=null;
                // } else {
                //     result.hasParams=true;
                //     result.params=getRouteParams(ordered[i].route,newRoute);
                // }
                // 
                // found=true;
                // 
                // break;
            }
        }

        return null;
    }

    function getRouteParams(baseRoute,routeWithParams) {
        return routeWithParams.substring(baseRoute.length);
    }

    function handleIfLinkClick(e) {
        let linkEl=e.target.closest('.spa-route,.spa-subpage');

        if(!linkEl) {
            return;
        }

        e.preventDefault();

        let newPage=linkEl.getAttribute('href');
        historyPushState(newPage);
        changeVisiblePage(newPage);
    }

    function historyPushState(newRoute) {
        window.history.pushState(newRoute,null,newRoute);
        console.log('setcurrentroute (pushstate): ',newRoute);
    }

    function changeVisiblePage(newRoute) {
        let newRouteCfg=getBestRouteMatch(newRoute);
        let currentRouteCfg=getBestRouteMatch(currentPageFullPath);
        let isAnyPageVisibleNow=!!currentRouteCfg;

        if(!newRouteCfg) {
            showSpaPageNotFound();
            return;
        }

        if(!currentRouteCfg || newRouteCfg.route!==currentRouteCfg.route) {
            let newEl=newRouteCfg.element;
            let fadeout='spa-routing-fade-out';
            let cssTransitionTime=100;
            let curEl=isAnyPageVisibleNow? currentRouteCfg.element:null;

            newEl.classList.add(fadeout);
            isAnyPageVisibleNow&&curEl.classList.add(fadeout);

            setTimeout(() => {
                isAnyPageVisibleNow&&curEl.classList.add('hide');
                newEl.classList.remove('hide');
                newEl.classList.remove(fadeout);
            },cssTransitionTime);
        }

        newRouteCfg.elementInstance&&newRouteCfg.elementInstance.show();
        currentPageFullPath=newRoute;
    }

    function showSpaPageNotFound(currentRoute,newRoute) {
        spaPageNotFoundEl.style.display='';
    }

    function onSpaPageNotFoundHomeButtonClick() {
        spaPageNotFoundEl.style.display='none';
    }

    return {
        initRoutes: initRoutes,
    };
})();