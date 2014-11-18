/**
 * Created by pheadra on 10/31/14.
 */
app.factory('quickstarts', ['$http', '$q','server_url', function ($http, $q, server_url) {
    var factory = {};

    factory.testData = function(applicationkey) {
//http://api.haru.io/1/classes/TestObject?where={"foo":"bar"}&count=1&limit=0
        var url = server_url + '/1/classes/TestObject?where={"foo":"bar"}&count=1&limit=1';
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


    return factory;
}]);