app.factory('appConfigs', ['$http', '$q', 'server_url', function ($http, $q, server_url) {
    var factory = {};

    factory.getParams = function(applicationkey) {
        var url = server_url + '/1/config';
        var deferred = $q.defer();
        $http({url:url,
            method:'GET',
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                //console.log(response);
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    factory.AddParam = function(applicationkey, data) {
        var url = server_url + '/1/config';
        var deferred = $q.defer();
        $http({url:url,
            method:'POST',
            data:data,
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                //console.log(response);
                deferred.resolve(response.data);

            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;

    };
    factory.updateParam = function(applicationkey, data) {
        var url =  server_url +'/1/config';

        var deferred = $q.defer();
        $http({url:url,
            method:'PUT',
            data:data,
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
               // console.log(response);
                deferred.resolve(response.data);

            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    factory.deleteParam = function(applicationkey, data) {
        var url = server_url + '/1/config';
        var deferred = $q.defer();
        $http({url:url,
            method:'DELETE',
            data:data,
            headers:{'Application-Id':applicationkey,'Content-Type': 'application/json'}})
            .then(function(response) {
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    return factory;
}])