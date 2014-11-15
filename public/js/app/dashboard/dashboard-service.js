/**
 * Created by pheadra on 10/31/14.
 */
app.factory('dashboards', ['$http', '$q', function ($http, $q) {
    var factory = {};
    factory.getDashboardData = function(csrf, applicationkey) {
        var param = {'csrf-token':csrf, 'appid': applicationkey};

        var url = '/dashboard';
        var deferred = $q.defer();
        $http({url:url,
            method:'GET',
            params:param,
            headers:{'Application-Id':applicationkey, 'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(function(response) {
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    return factory;
}]);