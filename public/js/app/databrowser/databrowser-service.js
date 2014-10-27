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


    factory.addSchemas = function(csrftoken, authtoken, appid, classes, columnname, columntype) {
        var url = 'csrf-token=' + csrftoken + '&token=' + authtoken +'&appid=' + appid +'&class=' + classes +'&columnname=' + columnname +'&columntype=' + columntype;
        //console.log(url);

        var deferred = $q.defer();
        $http({url:'data/column/add',
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


    factory.addClasses = function(applicationkey, classname) {
        //var url = 'csrf-token=' + csrftoken + '&token=' + authtoken +'&appid=' + appid +'&class=' + classes +'&columnname=' + columnname +'&columntype=' + columntype;
        //console.log(url);

        var url = 'http://stage.haru.io:10200/1/classes/' + classname;
        var deferred = $q.defer();
        $http({url:url,
            method:'POST',
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                console.log(response);
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;

    };

    factory.addRow = function(applicationkey, classname) {
        //var url = 'csrf-token=' + csrftoken + '&token=' + authtoken +'&appid=' + appid +'&class=' + classes +'&columnname=' + columnname +'&columntype=' + columntype;

        var url = 'http://stage.haru.io:10200/1/classes/' + classname;
        console.log(url);

        var deferred = $q.defer();
        $http({url:url,
            method:'POST',
            data:'{"createdAt":123}',
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                console.log(response);
                deferred.resolve(response.data);

            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;

    };

    factory.deleteClasses = function(applicationkey, classname) {
        //var url = 'csrf-token=' + csrftoken + '&token=' + authtoken +'&appid=' + appid +'&class=' + classes +'&columnname=' + columnname +'&columntype=' + columntype;
        //console.log(url);

        var url = 'http://stage.haru.io:10200/1/classes/' + classname;
        var deferred = $q.defer();
        $http({url:url,
            method:'DELETE',
            headers:{'Application-Id':applicationkey}})
            .then(function(response) {
                console.log(response);
                deferred.resolve(response.data);
            }, function(x) {
                deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;

    };

    factory.deleteRows = function(applicationkey, classname, data) {
        //var url = 'csrf-token=' + csrftoken + '&token=' + authtoken +'&appid=' + appid +'&class=' + classes +'&columnname=' + columnname +'&columntype=' + columntype;
        var url = 'http://stage.haru.io:10200/1/classes/' + classname;
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
}]);