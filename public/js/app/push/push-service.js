// A RESTful factory for retreiving mails from 'mails.json'
app.factory('pushs', ['$http', '$q', function ($http, $q) {
  var path = 'js/app/push/mails.json';
  var mails = $http.get(path).then(function (resp) {
    return resp.data.mails;
  });

  var factory = {};
  factory.all = function () {
    return mails;
  };
  factory.get = function (id) {
    return mails.then(function(mails){
      for (var i = 0; i < mails.length; i++) {
        if (mails[i].id == id) return mails[i];
      }
      return null;
    })
  };

  factory.sendpush = function(csrftoken, appid, pushtype, wherevalue, message, messagetype, totalcount, sendtimezone, sendtime, expirationtime, status){
      var data = 'csrf-token='+csrftoken+'&appid='+appid +'&pushtype=' +pushtype + '&wherevalue=' +wherevalue+ '&message='+message+'&messagetype='+messagetype +'&totalcount=' + totalcount+'&sendtimezone=' + sendtimezone+'&sendtime=' + sendtime+'&expirationtime=' + expirationtime + '&status=' + status
      console.log(data);
      var deferred = $q.defer();
      $http({url:'push/register',
          method:'POST',
          data:data,
          headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
          .then(function(response) {
              console.log(response);
              deferred.resolve(response.data);
          }, function(x) {
              deferred.reject({ error: "Server Error" });
          });
      return deferred.promise;

  };

  factory.pushlists = function(csrftoken, authtoken, limit, pages){
    var data = 'csrf-token='+csrftoken+'&authtoken='+authtoken +'&limit=' +limit + '&pages=' + pages;

    var deferred = $q.defer();
    $http({url:'push/list',
        method:'GET',
        data:data,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
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