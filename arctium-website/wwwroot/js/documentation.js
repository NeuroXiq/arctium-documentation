
var documentation = (function () {
    arctiumInit.onBodyLoaded(init);
    
    return {
        show: function () { show(); }
    }

    var documentationEl, documentationAjax, pagesListEl;
    var pageListItemTemplate, contentEl;

    function init() {
        documentationEl = document.getElementById('documentation');
        pageListItemTemplate = document.getElementById('template-left-bar-list-item').content.cloneNode(true);
        pagesListEl = document.getElementById('documentation-nav-pages-list');
        contentEl = document.getElementById('documentation-content');

        documentationAjax = new arctium.ajax('documentation');
        show();
    }

    function show() {
        documentationEl.style = '';
        setTimeout(() => documentationEl.classList.remove('documentation-fade-out'), 10);

        documentationAjax.fetch('GetPagesMetadata', {})
            .then(result => showPagesList(result));

        pagesListEl.addEventListener('click', handleContentChange);
    }

    function handleContentChange(e) {
        var aEl = e.target.closest('.a-spa');
        if (!aEl) {
            return;
        }

        e.preventDefault();

        var currentSelected = pagesListEl.querySelector('.selected');
        var newContent = aEl.getAttribute('href');

        if (currentSelected && currentSelected.getAttribute('href') === newContent) {
            return;
        }

        currentSelected && currentSelected.classList.remove('selected');
        aEl.classList.add('selected');

        changeContent(newContent);
    }

    function changeContent(name) {
        arctium.global.togglePageLoading(true);
        var options = {
            method: 'POST',
            body: JSON.stringify({ contentName: name }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        contentEl.classList.add('fade-out');

        var waitToFinishAnimation = new Promise((resolve) => setTimeout(resolve, 100));

        var ajax = documentationAjax.fetchRaw('getContent', options)
            .then(response => response.text())
            .then(contentPageHtml => {
                arctium.global.togglePageLoading(false);
                return contentPageHtml;
            });

        Promise.all([waitToFinishAnimation, ajax])
            .then(promises => {
                var contentPageHtml = promises[1];

                contentEl.innerHTML = contentPageHtml;
                contentEl.classList.remove('fade-out');
            });
    }

    function showPagesList(pagesList) {
        pagesList.forEach(page => {
            let listItem = pageListItemTemplate.cloneNode(true);
            let aEl = listItem.querySelector('a');

            aEl.innerHTML = page.name;
            aEl.setAttribute('href', page.htmlPageName);

            pagesListEl.appendChild(listItem);
        });
    }
})();