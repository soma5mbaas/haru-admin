
function genernatiorticks(start, end){
  //console.log(end.format('MM-DD'), start.format('MM-DD'));
  var lineticks = [];
  var duration = moment.duration(end.diff(start)).days();

  //console.log(duration );
  for(i = 0; i <= duration; i++){
    //console.log(duration-i, moment(end).subtract(duration - i , 'days').format('MM-DD'));
    lineticks.push([i + 1, moment(end).subtract(duration - i, 'days').format('YYYY-MM-DD')]);
  }
  console.log(JSON.stringify(lineticks));
  return lineticks;
}

app.controller('MonetizationCtrl', ['$scope', '$http', 'limitToFilter','monetizations',  function($scope, $http, limitToFilter, monetizations) {
  //ng-init="date ='07/15/2014 - 07/15/2014'"
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  var applicationkey = '';
  if (!isEmpty($scope.user.currentproject)) {
    applicationkey = $scope.user.currentproject.applicationkey;
  }

  var startday = moment().subtract(7, 'days');
  var endday =  moment();

  $scope.grapherefrash = 0;
  var grapherefrash =0;

  $scope.lineticks = genernatiorticks(startday, endday);

  //console.log($scope.lineticks);

  $scope.totalprices = [];
  $scope.countusers = [];
  $scope.avgprices = [];
  $scope.avgtotaluser = [];
  $scope.avgsalesuserrates = [];
  $scope.itemcounts = [];


  $scope.productlist = [];


  var getMonetization = function(startday, endday, nation){
    monetizations.getMonetization(applicationkey, startday, endday, nation).then(function(result) {
      console.log(JSON.stringify(result));
      var totalprices = [];
      var countusers = [];
      var avgprices = [];
      var avgtotaluser = [];
      var avgsalesuserrates = [];
      var itemcounts = [];
      $scope.lineticks.forEach(function (elem, index) {
        var total = 0;
        var salesusers = 0;
        var avgprice = 0;
        var totalusers = 0;
        var itemcount = 0;

        for (i = 0; i < result.length; i++) {
          if (elem[1] == result[i].buydate) {
            total = result[i].totalprice;
            salesusers = result[i].countsalesuser;
            avgprice = result[i].avgprice;
            totalusers = result[i].usercount;
            itemcount = result[i].itemcount;
            break;
          }
        }
        totalprices.push([index + 1, total]);
        countusers.push([index + 1, salesusers]);
        avgprices.push([index + 1, avgprice.toFixed(2)]);
        avgtotaluser.push([index + 1, (total / totalusers).toFixed(2)]);
        avgsalesuserrates.push([index + 1, (salesusers / totalusers).toFixed(2)]);
        itemcounts.push([index + 1, itemcount])
      });
      //console.log('total price : ', JSON.stringify(totalprices));
      console.log('count users : ', JSON.stringify(countusers));
      console.log('average sales prices : ', JSON.stringify(avgprices));
      console.log('average total user prices : ', JSON.stringify(avgtotaluser));
      console.log('average sales user rates : ', JSON.stringify(avgsalesuserrates));
      console.log('sale item count : ', JSON.stringify(itemcounts));
      $scope.totalprices = totalprices;
      $scope.countusers = countusers;
      $scope.avgprices = avgprices;
      $scope.avgtotaluser = avgtotaluser;
      $scope.avgsalesuserrates = avgsalesuserrates;
      $scope.itemcounts = itemcounts;

      $scope.grapherefrash = grapherefrash++;
    });


    monetizations.getMonetizationitemlist(applicationkey, startday, endday, nation).then(function(result) {
      console.log(result);

      $scope.productlist = result.itemlist;
    });
  };
  console.log(startday);
  getMonetization(startday.format('YYYY-MM-DD'), endday.format('YYYY-MM-DD'), 'ko');


  // daterangepicker
  //console.log(angular.element(document.querySelector('meta[name=csrf-token]')).context.content);
  $scope.date = moment().subtract(7, 'days').format('YYYY-MM-DD') + " ~ " + moment().format('YYYY-MM-DD');
  angular.element(document.querySelector('#reservation')).daterangepicker({
    format: 'YYYY-MM-DD',
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
    console.log(moment.duration(end.diff(start)).days());


    $scope.lineticks = genernatiorticks(start, end);
    console.log(JSON.stringify($scope.lineticks));

    getMonetization(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), 'ko');


  });



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
  };
  $scope.d4 = $scope.getRandomData();


  // title nation selector
  $scope.nation = [
    {id:1, nation:"All", area:"All", value:'all', edit:false},
    {id:1, nation:"USA", area:"North America", value:'us', edit:false},
    {id:2, nation:"Korea", area:"Asia", value:'kr', edit:false},
    {id:3, nation:"Japan", area:"Asia", value:'jp', edit:false},
    {id:4, nation:"China", area:"Asia", value:'cn', edit:false},
    {id:5, nation:"England", area:"Europe", value:'en', edit:false},
    {id:6, nation:"France", area:"Europe", value:'fr', edit:false}
  ];
  $scope.code = 'all';

  $scope.selectnation = [];//$scope.nation;

  $scope.qTerms = $scope.nation;

  $scope.removeTerm = function(index){
    var removenation = $scope.qTerms.splice(index, 1);
    console.log(removenation);
    $scope.selectnation.push(removenation[0]);
  };

  $scope.addTerm = function(){
    console.log('addTerm');
    $scope.qTerms.push({nation:"", area:"", edit:true});
  };

  $scope.selectblur = function(myOption){
    for(i = 0; i< $scope.qTerms.length; i++){
      if($scope.qTerms[i].nation === ''){
        $scope.qTerms.splice(i, 1);
        break;
      }
    }
    $scope.qTerms.push({nation:"", area:"", edit:true});
  };

  $scope.isfocus = true;
  $scope.selectAction = function(term, myOption){
    var selectindex = 0;

    $scope.selectnation.forEach(function(elem, index, arr){
      if(elem.nation === myOption){
        selectindex = index;
        term.nation = $scope.selectnation[index].nation;
        term.area = $scope.selectnation[index].area;
        term.edit = false;

      }
    });
    $scope.selectnation.splice(selectindex, 1);
  };

  $scope.myOption = '';


  $scope.reviewReflash = function (nation) {
    console.log(nation);
    $scope.code = nation.value;
  }
}]);