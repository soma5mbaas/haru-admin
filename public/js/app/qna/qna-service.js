/**
 * Created by pheadra on 10/31/14.
 */
app.factory('qnas', ['$http', '$q','server_url', function ($http, $q, server_url) {
    var factory = {};

    factory.getQuestionList = function(applicationkey) {
        var url = server_url + '/1/qna/list';
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

    factory.addComment = function(applicationkey, id, comment) {
        var url = server_url + '/1/qna/comment/' + id;
        console.log(url);
        var data = '{"content":"'+comment+'"}';

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


    factory.deleteQna = function(applicationkey, id) {
        var url = server_url + '/1/qna/' + id;
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