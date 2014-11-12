app.controller('DashboardCtrl', ['$scope', '$http', 'dashboards', '$window', '$state', function($scope, $http, dashboards, $window, $state) {

  if(isEmpty($scope.user.currentproject)){
    $window.alert('project를 선택해 주십시오!!!');

    console.log($scope.user.currentproject, $state.current.name);
    $state.go('app.projects');
  }
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  $scope.apirequestdatas = [];
  $scope.pushrequestdatas = [];

  if(!isEmpty($scope.user.currentproject)) {
    var lineticks = [];
    for(i = 0; i <= 8; i++){
      lineticks.push([i, moment().subtract(8 - i, 'days').format('YYYY-MM-DD')]);
    }
    $scope.lineticks = lineticks;

    var csrf = angular.element(document.querySelector('meta[name=csrf-token]')).context.content;
    dashboards.getDashboardData(csrf, $scope.user.currentproject.applicationkey).then(function (result) {
      console.log(result);

      var apirequest = result.api;
      var pushrequest = result.push;

      var apirequestdatas = [];
      var pushrequestdatas = [];


      lineticks.forEach(function(elem, index){
        var apicount = 0;
        for(i = 0; i < apirequest.length; i++ ){
          if(elem[1] == apirequest[i].reqdate){
            apicount = apirequest[i].count;
            break;
          }
        }
        apirequestdatas.push([(index +1) , apicount]);

        var pushcount = 0;
        for(i = 0; i < pushrequest.length; i++ ){
          if(elem[1] == pushrequest[i].reqdate){
            pushcount = pushrequest[i].count;
            break;
          }
        }
        pushrequestdatas.push([(index +1), pushcount]);

      });
      $scope.apirequestdatas = apirequestdatas;
      $scope.pushrequestdatas = pushrequestdatas;

      console.log(JSON.stringify(apirequestdatas));
      console.log(JSON.stringify(pushrequestdatas));

    }, function (error) {
      console.log(error);
    })
  }





  var d111 = [];
  for (var i = 0; i <= 10; i += 1) {
    d111.push([i, parseInt(Math.random() * 30)]);
  }
  $scope.d111 = d111;

  var d222 = [];
  for (var i = 0; i <= 10; i += 1) {
    d222.push([i, parseInt(Math.random() * 30)]);
  }
  $scope.d222 = d222;
  var d333 = [];
  for (var i = 0; i <= 10; i += 1) {
    d333.push([i, parseInt(Math.random() * 30)]);
  }
  $scope.d333 = d333;

  var data = [],
      series = Math.floor(Math.random() * 6) + 3;

  for (var i = 0; i < series; i++) {
    data[i] = {
      label: "Series" + (i + 1),
      data: Math.floor(Math.random() * 100) + 1
    }
  }
  $scope.flotpiedata = data;

  $scope.d = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];

  $scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];

  $scope.d0_2 = [ [0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3] ];

  $scope.d1_1 = [ [10, 120], [20, 70], [30, 70], [40, 60] ];

  $scope.d1_2 = [ [10, 50],  [20, 60], [30, 90],  [40, 35] ];

  $scope.d1_3 = [ [10, 80],  [20, 40], [30, 30],  [40, 20] ];

  $scope.d2 = [];

  for (var i = 0; i < 20; ++i) {
    $scope.d2.push([i, Math.sin(i)]);
  }

  $scope.d3 = [
    { label: "iPhone5S", data: 40 },
    { label: "iPad Mini", data: 10 },
    { label: "iPad Mini Retina", data: 20 },
    { label: "iPhone4S", data: 12 },
    { label: "iPad Air", data: 18 }
  ];

  $scope.refreshData = function(){
    $scope.d0_1 = $scope.d0_2;
  };

  $scope.getRandomData = function() {
    var data = [],
        totalPoints = 150;
    if (data.length > 0)
      data = data.slice(1);
    while (data.length < totalPoints) {
      var prev = data.length > 0 ? data[data.length - 1] : 50,
          y = prev + Math.random() * 10 - 5;
      if (y < 0) {
        y = 0;
      } else if (y > 100) {
        y = 100;
      }
      data.push(y);
    }
    // Zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < data.length; ++i) {
      res.push([i, data[i]])
    }
    return res;
  }

  $scope.d4 = $scope.getRandomData();

}]);