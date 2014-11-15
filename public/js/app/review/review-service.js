/**
 * Created by pheadra on 10/31/14.
 */
app.factory('reviews', ['$http', '$q', function ($http, $q) {
    var factory = function(appid, lang, market) {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.next = 0;
        this.appid = appid;
        this.language = lang;
        this.market = market;
    };


    factory.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;

        var limit = 30;
        var csrftoken = $('meta[name=csrf-token]').attr('content');
        var data = {'csrf-token':csrftoken, 'appid':this.appid, 'limit':limit, 'page': this.next, 'lang' : this.language, market: this.market };

        $http({url:'/reviews/list',
            method:'GET',
            params:data,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(function(response) {
                //console.log(response);
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

    factory.getReviewStatistics = function(csrf, applicationkey, code) {
        var param = {'csrf-token':csrf, 'appid': applicationkey, 'code':code};

        var url = '/reviews/statistics';
        var deferred = $q.defer();
        $http({url:url,
            method:'GET',
            params:param,
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    factory.getReviewInfo = function(csrf, applicationkey) {
        var param = {'csrf-token':csrf, 'appid': applicationkey};
        console.log(param);
        var url = '/reviews/info';
        var deferred = $q.defer();
        $http({url:url,
            method:'GET',
            params:param,
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                console.log(response);
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };
    return factory;
}]);