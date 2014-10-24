// A RESTful factory for retreiving mails from 'mails.json'
app.factory('pushlists', ['$http', function ($http) {
    var Reddit = function() {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.next = 0;
    };

    Reddit.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;

        var limit = 50;
        var csrftoken = $('meta[name=csrf-token]').attr('content');
        var data = {'csrf-token':csrftoken,'limit':limit, 'page':this.next};

        $http({url:'push/list',
            method:'GET',
            params:data,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(function(response) {
                console.log(response.data);
                var items = response.data;
                for (var i = 0; i < items.length; i++) {
                    this.items.push(items[i]);
                }

                this.next = this.next + 1;

                if(items.length >= limit) {
                    this.busy = false;
                }
            }.bind(this));
    };

    return Reddit;
}]);