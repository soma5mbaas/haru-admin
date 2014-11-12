/**
 * Created by pheadra on 10/31/14.
 */
app.factory('dashboards', ['$http', '$q', function ($http, $q) {
    var factory = {};
    factory.getDashboardData = function(applicationkey) {
        var param = {'appid': applicationkey};

        var url = '/dashboard';
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

    return factory;
}]);