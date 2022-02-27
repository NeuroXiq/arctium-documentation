var arctiumInit = (function () {
    var callbacks = [];
    var docLoadedCallbacks = [];

    var bodyLoaded = false;
    var docLoaded = false;


    function onBodyLoaded(callback) {
        if (bodyLoaded) {
            callback();
            return;
        }

        callbacks.push(callback);
    }

    function invokeBodyLoaded() {
        bodyLoaded = true;

        callbacks.forEach((callback) => callback());
    }

    function invokeOnDocumentLoaded() {
        docLoaded = true;

        docLoadedCallbacks.forEach(callback => callback());
    }

    function onDocumentLoaded(callback) {
        if (docLoaded) {
            callback();
            return;
        }

        docLoadedCallbacks.push(callback);
    }

    return {
        onBodyLoaded: onBodyLoaded,
        onDocumentLoaded: onDocumentLoaded,
        invokeBodyLoaded: invokeBodyLoaded,
        invokeOnDocumentLoaded: invokeOnDocumentLoaded
    }
})();