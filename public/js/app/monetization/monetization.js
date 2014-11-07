app.controller('MonetizationTitleCtrl', ['$scope', '$http', 'limitToFilter',  function($scope, $http, limitToFilter) {
  $scope.nation = [{nation:"Korea", area:"asia"}, {nation:"Japen", area:"asia"}, {nation:"China", area:"asia"}];
  $scope.qTerms = [{nation:"Korea", area:"asia", edit:false}, {nation:"Japen", area:"asia", edit:false}, {nation:"China", area:"asia", edit:false}];

  $scope.removeTerm = function(index){
    $scope.qTerms.splice(index, 1);
  }

  $scope.addTerm = function(){
    $scope.qTerms.push({nation:"Korea", area:"asia", edit:true});
  }


  $scope.address = {};
  $scope.refreshAddresses = function(address) {
    /*
    var params = {address: address, sensor: false};
    return $http.get(
        'http://maps.googleapis.com/maps/api/geocode/json',
        {params: params}
    ).then(function(response) {

          $scope.addresses = response.data.results;
        });*/
    $scope.addresses = $scope.countries
  };
  $scope.myFunc = function(event){
    console.log(event);
  }

  $scope.inputNation  = function(index){
    console.log(index);
    //$scope.qTerms[index].edit=false;
  };

  $scope.isfocus = true;

  $scope.selectAction = function(term){
    console.log($scope.myOption, term);
    term.edit=false;
  }

  $scope.myOptions= [
    {
      "id": 100,
      "label": "Korea"
    },
    {
      "id": 101,
      "label": "Japen"
    },
    {
      "id": 102,
      "label": "China"
    },
    {
      "id": 103,
      "label": "America"
    },
    {
      "id": 104,
      "label": "France"
    }];
  $scope.myOption = 'Korea';

}]);

  app.controller('MonetizationCtrl', ['$scope', '$http', 'limitToFilter',  function($scope, $http, limitToFilter) {

  $scope.totalrevenue = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7],[13,7], [14,7] ];

  $scope.d = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];
  $scope.d2 = [ [1,4.5],[2,1.5],[3,4],[4,10],[5,7],[6,7],[7,2],[8,7],[9,10],[10,7],[11,6.8],[12,7] ];

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


  $scope.myDateRange = { "startDate": "2013-09-19T15:00:00.000Z", "endDate": "2013-09-24T15:00:00.000Z" };


  $scope.change = function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  };

  angular.element(document.querySelector('#reservation')).daterangepicker({

  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });




}]);