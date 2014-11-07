/**
 * Created by pheadra on 10/31/14.
 */
app.factory('reviews', ['$http', '$q', function ($http, $q) {
    var factory = {};

    factory.getReviewList = function(applicationkey, market, page, limit) {
        var param = {'appid': applicationkey, 'market': market, 'page':page, 'limit':limit};

        var url = '/reviews/list';
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