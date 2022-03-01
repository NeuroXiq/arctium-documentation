
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
    }

    function show() {
        documentationAjax.fetch('GetPagesMetadata', {})
            .then(result => showPagesList(result));

        showAlgorithmsSummary();
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

    function showAlgorithmsSummary() {
        let algorithms=documentationAjax.fetch('GetAlgorithmsSummary');

        let options={
            method: 'POST',
            body: JSON.stringify({contentName: 'algorithms-summary-template.html'}),
            headers: {
                'Content-Type': 'application/json'
            }
        };


        algorithms.then(algorithmsData => {
            let grouped={};

            let statusInfo={
                '0': {text: 'OK',color: 'lawngreen'},
                '1': {text: 'Partial',color: 'darkkhaki'},
                '2': {text: 'TODO',color: 'lightgray'},
                '3': {text: 'Not implemented',color: 'darkgray'}
            }

            algorithmsData.forEach(algo => {
                grouped[algo.group]=grouped[algo.group]||[];
                grouped[algo.group].push(algo);
            });

            for(let groupName in grouped) {
                let dataRows=grouped[groupName];

                let table = document.createElement('table');
                let caption=table.createCaption();
                let thead=table.createTHead();
                let tbody=table.createTBody();

                caption.innerHTML=groupName;

                theadRow=thead.insertRow(-1);
                theadRow.insertCell(-1).innerHTML='Name';
                theadRow.insertCell(-1).innerHTML='Standard';
                theadRow.insertCell(-1).innerHTML='Doc';
                theadRow.insertCell(-1).innerHTML='Status';


                dataRows.forEach(dataRow => {
                    let row=tbody.insertRow(-1);
                    let arctiumDocLink=document.createElement('a');
                    let standardDocLink=document.createElement('a');
                    
                    arctiumDocLink.classList.add('link');
                    standardDocLink.classList.add('link');
                    arctiumDocLink.href=dataRow['arctiumWebsiteDocumentationUrl'];
                    standardDocLink.href=dataRow['standardWebsiteUrl'];
                    arctiumDocLink.innerHTML='Doc';
                    standardDocLink.innerHTML=dataRow['standardName'];

                    row.insertCell(-1).innerHTML=dataRow['algorithmName'];
                    row.insertCell(-1).appendChild(standardDocLink);
                    row.insertCell(-1).appendChild(arctiumDocLink);

                    let status=dataRow['status'];
                    let statusCell=row.insertCell(-1);
                    statusCell.innerHTML=statusInfo[status].text;
                    statusCell.style.color=statusInfo[status].color;
                });

                contentEl.appendChild(table);
            }

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