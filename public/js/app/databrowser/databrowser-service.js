// A RESTful factory for retreiving mails from 'mails.json'
app.factory('databrowsers', ['$http', '$q', function ($http, $q) {

    var factory = {};


    factory.getClasses = function(csrftoken, authtoken, appid) {
        var deferred = $q.defer();

        $http({url:'data/class',
            method:'POST',
            data:'csrf-token=' + csrftoken + '&token=' + authtoken +'&appid=' + appid,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(function(response) {
                if (response.data) {
                    deferred.resolve(response.data);
                }else{
                    deferred.reject(response.data)
                }
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };

    factory.getSchemas = function(csrftoken, authtoken, appid, classes) {
        var url = 'csrf-token=' + csrftoken + '&token=' + authtoken +'&appid=' + appid +'&class=' + classes;
        //console.log(url);

        var deferred = $q.defer();
        $http({url:'data/schema',
            method:'POST',
            data:url,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(function(response) {
                //console.log(response);
                if (response.data) {
                    deferred.resolve(response.data);
                }else{
                    deferred.reject(response.data)
                }
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
    };


  return factory;
}]);