/**
 * Created by pheadra on 10/31/14.
 */
app.factory('notices', ['$http', '$q','server_url', function ($http, $q, server_url) {
    var factory = {};

    factory.getNotice = function(applicationkey) {

        var url = server_url + '/1/notice/list';
        var deferred = $q.defer();
        $http({url:url,
            method:'GET',
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                console.log(response);
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    factory.createNotice = function(applicationkey, data) {
        var url =  server_url + '/1/notice/add';
        var deferred = $q.defer();
        $http({url:url,
            method:'POST',
            data:data,
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                console.log(response);
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;

    };
    factory.updateParam = function(applicationkey, data) {
        var url =  server_url + '/1/notice/list';

        var deferred = $q.defer();
        $http({url:url,
            method:'PUT',
            data:data,
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                console.log(response);
                deferred.resolve(response.data);

            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    factory.deleteNotice = function(applicationkey, id) {
        var url =  server_url + '/1/notice/' + id;
        var deferred = $q.defer();
        $http({url:url,
            method:'DELETE',
            headers:{'Application-Id':applicationkey,'Content-Type': 'application/json'}})
            .then(function(response) {
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    return factory;
}]);