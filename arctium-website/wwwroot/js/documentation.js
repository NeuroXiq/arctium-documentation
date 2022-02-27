
var documentation = (function () {
    arctiumInit.onBodyLoaded(init);
    
    return {
        show: function () { show(); }
    }

    var documentationEl;

    function init() {
        documentationEl = document.getElementById('documentation');
    }

    function show() {
        documentationEl.style = '';
        setTimeout(() => documentationEl.classList.remove('documentation-fade-out'), 10);
    }
})();