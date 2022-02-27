(function () {
    arctium.ajax = function (controller) {
        this.controller = controller;

        this.fetchRaw = function(action, options) {
            var url = `${controller}/${action}`;

            return fetch(url, options);
        }

        this.fetch = function(action, postBody) {
            var data = JSON.stringify(postBody);
            var options = {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return this.fetchRaw(action, options)
                .then(response => response.json())
                .catch(error => console.log('FETCH ERROR', error));

            return fetchObj;
        }
    }
})();