arctium.global = {}

var arctiumGlobal = (function () {
    var globalPageLoadingId = 'global-page-loading';

    function togglePageLoading(toggle) {
        if (!toggle) {
            var currentLoadingDiv = document.getElementById(globalPageLoadingId);

            currentLoadingDiv && currentLoadingDiv.remove();
            return;
        }

        var div = document.createElement('div');
        var circle = document.createElement('div');

        div.id = globalPageLoadingId;
        div.classList.add('page-loading');
        div.style = 'opacity: 0;';

        circle.classList.add('spinning-circle');

        div.appendChild(circle);

        document.body.appendChild(div);

        setTimeout(() => div.style = 'opacity: 1', 20);
    }

    return {
        togglePageLoading: togglePageLoading
    }
})();

arctium.global = arctiumGlobal;
