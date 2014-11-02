/**
 * Created by pheadra on 10/31/14.
 */
app.factory('qnas', ['$http', '$q', function ($http, $q) {
    var factory = {};

    factory.getQuestionList = function(applicationkey) {
        var url = 'http://stage.haru.io:3000/qna/list';
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
        var url = 'http://stage.haru.io:3000/qna/comment/' + id;
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
        var url = 'http://stage.haru.io:3000/qna/' + id;
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