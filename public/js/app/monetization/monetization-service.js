/**
 * Created by pheadra on 10/31/14.
 */
app.factory('monetizations', ['$http', '$q','server_url', function ($http, $q, server_url) {
  var factory = {};

  factory.getMonetization = function(applicationkey, startday, endday, nation) {
    var param = {'appid':applicationkey, 'startday':startday, 'endday': endday, 'nation':nation};
    console.log(param);
    var url = '/monetization';

    var deferred = $q.defer();
    $http({url:url,
      method:'GET',
      params:param,
      headers:{'Application-Id':applicationkey}})
        .then(function(response) {
          //console.log(response);
          deferred.resolve(response.data);
        }, function(x) {
          deferred.reject({ error: "Server Error" });
        });
    return deferred.promise;
  };

  factory.getMonetizationitemlist = function(applicationkey, startday, endday, nation) {
    var param = {'appid':applicationkey, 'startday':startday, 'endday': endday, 'nation':nation};
    console.log(param);
    var url = '/monetization/item';

    var deferred = $q.defer();
    $http({url:url,
      method:'GET',
      params:param,
      headers:{'Application-Id':applicationkey}})
        .then(function(response) {
          //console.log(response);
          deferred.resolve(response.data);
        }, function(x) {
          deferred.reject({ error: "Server Error" });
        });
    return deferred.promise;
  };


  return factory;
}]);