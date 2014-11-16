/**
 * Created by pheadra on 10/31/14.
 */
app.factory('faqs', ['$http', '$q', 'server_url', function ($http, $q, server_url) {
  var factory = {};

  factory.getFaqCategory = function(applicationkey) {

    var url = server_url + '/1/faq/category/list';
    var deferred = $q.defer();
    $http({url:url,
      method:'GET',
      headers:{'Application-Id':applicationkey}})
        .then(function(response) {
          deferred.resolve(response.data);
        }, function(x) {
          deferred.reject({ error: "Server Error" });
        });
    return deferred.promise;
  };
  factory.addFaqCategory = function(applicationkey, category) {
    var data = '{"category": "'+category+'"}';

    var url = server_url + '/1/faq/category/add/';
    var deferred = $q.defer();
    $http({url:url,
      method:'POST',
      data:data,
      headers:{'Application-Id':applicationkey}})
        .then(function(response) {
          deferred.resolve(response.data);
        }, function(x) {
          deferred.reject({ error: "Server Error" });
        });
    return deferred.promise;
  };

  factory.getFaqList = function(applicationkey,catgory) {

    var url = server_url + '/1/faq/list';
    if(catgory != 'All'){
      url = url + '/'+catgory;
    }

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
    var url = server_url + '/1/notice/add';
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
    var url = server_url + '/1/notice/list';

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
    var url = server_url + '/1/notice/' + id;
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