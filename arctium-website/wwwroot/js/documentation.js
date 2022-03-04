
var documentation = (function () {
    arctiumInit.onBodyLoaded(init);
    
    return {
        show: function() {show();},
    }

    var documentationEl, documentationAjax, pagesListEl;
    var pageListItemTemplate,contentEl;
    var initialized;

    function init() {
        initialized=false;
        documentationEl = document.getElementById('documentation');
        pageListItemTemplate = document.getElementById('template-left-bar-list-item').content.cloneNode(true);
        pagesListEl = document.getElementById('documentation-nav-pages-list');
        contentEl = document.getElementById('documentation-content');

        documentationAjax = new arctium.ajax('documentation');
    }

    function show() {
        if(!initialized) {
            initialize().then(showCurrentPage);
        } else {
            showCurrentPage();
        }
    }

    function showCurrentPage() {
        if(window.location.pathname==='/documentation') {
            return;
        }


        let contentName=window.location.pathname.split('/')[2];

        var currentSelected=pagesListEl.querySelector('.selected');
        var newSelected=pagesListEl.querySelector(`[href="/documentation/${contentName}"]`);

        if(currentSelected&&currentSelected.getAttribute('href')===contentName) {
            return;
        }

        currentSelected&&currentSelected.classList.remove('selected');
        newSelected.classList.add('selected');

        changeContent(contentName);
    }

    function initialize() {
        return showPagesList().then(result => initialized = true);
    }

    function changeContent(name) {
        let contentHtml;

        if(name==='algorithms-summary') {
            contentHtml = getAlgorithmsSummaryHtml();
        } else {
            var options={
                method: 'POST',
                body: JSON.stringify({contentName: name}),
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            contentHtml=documentationAjax.fetchRaw('getContent',options)
                .then(response => response.text())
                .then(contentPageHtml => {
                    return contentPageHtml;
                });
        }

        arctium.global.togglePageLoading(true);

        contentEl.classList.add('fade-out');

        var waitToFinishAnimation = new Promise((resolve) => setTimeout(resolve, 100));

        Promise.all([waitToFinishAnimation, contentHtml])
            .then(promises => {
                arctium.global.togglePageLoading(false);
                var contentPageHtml = promises[1];

                contentEl.innerHTML = contentPageHtml;
                contentEl.classList.remove('fade-out');
            });
    }

    function getAlgorithmsSummaryHtml() {
        let algorithms=documentationAjax.fetch('GetAlgorithmsSummary');

        return algorithms.then(algorithmsDataObject => {
            let algorithmsData=algorithmsDataObject.algorithmsSummary;
            let contentContainer=document.createElement('div');
            contentContainer.classList.add('algorithms-summary');
            let grouped={};

            let contentTable=document.createElement('ul');
            contentTable.classList.add('content-table');
            contentContainer.appendChild(contentTable);

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
                let contentTableItem=document.createElement('li');
                let contentTableLink=document.createElement('a');
                contentTableItem.classList.add('content-table__item');
                contentTableLink.href='#'+groupName;
                contentTableLink.innerHTML=groupName;
                contentTableLink.classList.add('link');

                contentTableItem.appendChild(contentTableLink);
                contentTable.appendChild(contentTableItem);

                let dataRows=grouped[groupName];
                let table = document.createElement('table');
                let caption=table.createCaption();
                let captionInnerH2Tag=document.createElement('h2');
                let thead=table.createTHead();
                let tbody=table.createTBody();

                captionInnerH2Tag.innerHTML=groupName;
                captionInnerH2Tag.id=groupName;
                caption.appendChild(captionInnerH2Tag);
                caption.classList.add('caption');

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
                    arctiumDocLink.classList.add('spa-route');
                    standardDocLink.classList.add('link');
                    arctiumDocLink.href='/documentation/'+dataRow['arctiumWebsiteDocumentationUrl'];
                    standardDocLink.href=dataRow['standardWebsiteUrl'];
                    arctiumDocLink.innerHTML='Doc';
                    standardDocLink.innerHTML=dataRow['standardName'];
                    standardDocLink.target="_blank";

                    row.insertCell(-1).innerHTML=dataRow['algorithmName'];
                    row.insertCell(-1).appendChild(standardDocLink);
                    row.insertCell(-1).appendChild(arctiumDocLink);

                    let status=dataRow['status'];
                    let statusCell=row.insertCell(-1);
                    statusCell.innerHTML=statusInfo[status].text;
                    statusCell.style.color=statusInfo[status].color;
                });

                contentContainer.appendChild(table);

                table.classList.add('table');
                table.querySelectorAll('td').forEach(td => td.classList.add('td'));
                table.querySelectorAll('tr').forEach(tr => tr.classList.add('tr'));
            }

            return contentContainer.outerHTML;
        });
    }

    function showPagesList(pagesList) {
        appendPageListItem('Algorithms summary','algorithms-summary');

        return documentationAjax.fetch('GetAlgorithmsSummary',{})
            .then(algoritmsSummary =>
                algoritmsSummary.algorithmsSummary.forEach(page =>
                    appendPageListItem(page.algorithmName,page.arctiumWebsiteDocumentationUrl)));

    }

    function appendPageListItem(pageName,pageHref) {
        let listItem=pageListItemTemplate.cloneNode(true);
        let aEl=listItem.querySelector('a');

        aEl.innerHTML=pageName;
        aEl.setAttribute('href','/documentation/' + pageHref);
        aEl.classList.add('spa-subpage');

        pagesListEl.appendChild(listItem);
    }
})();