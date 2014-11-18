app.controller('DashboardCtrl', ['$scope', '$http', 'dashboards', '$window', '$state', 'toaster', function($scope, $http, dashboards, $window, $state, toaster) {


 if(isEmpty($scope.user.currentproject)){
    toaster.pop('note', 'Select Project', '프로젝트를 선택해주세요.');
    console.log($scope.user.currentproject, $state.current.name);
    $state.go('app.projects');
  }
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  var csrf = angular.element(document.querySelector('meta[name=csrf-token]')).context.content;
  var applicationkey = $scope.user.currentproject.applicationkey;

  $scope.apirequestdatas = [];
  $scope.pushrequestdatas = [];
  $scope.dashboard = {usercount:0, revenue:0, request:0, totalSize:0, qnacount:0};


  if(!isEmpty($scope.user.currentproject)) {
    var lineticks = [];
    for(i = 0; i <= 8; i++){
      lineticks.push([i, moment().subtract(8 - i, 'days').format('YYYY-MM-DD')]);
    }
    $scope.lineticks = lineticks;




    getDashboardinfo = function(){
      dashboards.getDashboard(csrf, $scope.user.currentproject.applicationkey).then(function (result) {
        $scope.dashboard.usercount = result.usercount;
        $scope.dashboard.request = result.request;

        if(result.revenue.length == 2){
          $scope.dashboard.revenue = result.revenue[1].sum;

        } else {
          $scope.dashboard.revenue = result.revenue[0].sum;

        }

        //console.log('getDashboard',result);
      });

    };
    getDashboardinfo();


    var refluash = 0;

    getDashboardRequestData = function(){
      dashboards.getDashboardRequestData(csrf, $scope.user.currentproject.applicationkey).then(function (result) {
        //console.log(result);

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
          apirequestdatas.push([(index) , apicount]);

          var pushcount = 0;
          for(i = 0; i < pushrequest.length; i++ ){
            if(elem[1] == pushrequest[i].reqdate){
              pushcount = pushrequest[i].count;
              break;
            }
          }

          pushrequestdatas.push([(index), pushcount]);

        });
        $scope.apirequestdatas = apirequestdatas;
        $scope.pushrequestdatas = pushrequestdatas;

        //console.log(JSON.stringify(apirequestdatas));
        //console.log(JSON.stringify(pushrequestdatas));

        $scope.reflash = refluash++;
      }, function (error) {
        console.log(error);
      });

      dashboards.getFileSize($scope.user.currentproject.applicationkey).then(function (result) {
        //console.log(result);
        $scope.dashboard.totalSize = result.totalSize;
      }, function (error) {
        console.log(error);
      });

      dashboards.getQnaCount($scope.user.currentproject.applicationkey).then(function (result) {
        //console.log(result);
        $scope.dashboard.qnacount = result.return;
      }, function (error) {
        console.log(error);
      });

    }
    getDashboardRequestData();

    $scope.$watch('user.currentproject', function(){
      console.log('test');
      getDashboardinfo();
      getDashboardRequestData();
    });
  };


  $scope.clickrequestchart = function(){
    $scope.reflash = refluash++;
  };







  if($scope.user.currentproject != undefined
      && $scope.user.currentproject.applicationkey != undefined) {

      dashboards.getLatestQnR($scope.user.currentproject.applicationkey).then(function(result){
        $scope.parent.LatestRnQ = result;
      });
  }


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