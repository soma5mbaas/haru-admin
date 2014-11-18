
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

app.controller('MonetizationCtrl', ['$scope', '$http', 'limitToFilter','monetizations', 'toaster', '$state', function($scope, $http, limitToFilter, monetizations, toaster, $state) {
  //ng-init="date ='07/15/2014 - 07/15/2014'"

  if(isEmpty($scope.user.currentproject)){
    //$window.alert('project를 선택해 주십시오!!!');
    toaster.pop('note', 'Select Project', '프로젝트를 선택해주세요.');
    console.log($scope.user.currentproject, $state.current.name);
    $state.go('app.projects');
  }

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
  $scope.itemgraph = [];

  var getMonetization = function(startday, endday, nation){
    monetizations.getMonetization(applicationkey, startday, endday, nation).then(function(result) {
      //console.log(JSON.stringify(result));
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
      //console.log('count users : ', JSON.stringify(countusers));
      //console.log('average sales prices : ', JSON.stringify(avgprices));
      //console.log('average total user prices : ', JSON.stringify(avgtotaluser));
      //console.log('average sales user rates : ', JSON.stringify(avgsalesuserrates));
      //console.log('sale item count : ', JSON.stringify(itemcounts));
      $scope.totalprices = totalprices;
      $scope.countusers = countusers;
      $scope.avgprices = avgprices;
      $scope.avgtotaluser = avgtotaluser;
      $scope.avgsalesuserrates = avgsalesuserrates;
      $scope.itemcounts = itemcounts;

      $scope.grapherefrash = grapherefrash++;
    });


    monetizations.getMonetizationitemlist(applicationkey, startday, endday, nation).then(function(result) {
      console.log(JSON.stringify(result.nation));
      $scope.d3 = result.nation;

      var count = result.itemlist.length;
      if(count >= 5){
        count = 5;
      }

      var topproducts = [];
      for(i = 0; i < count; i++){
        topproducts.push(result.itemlist[i].productname);
      }

      console.log(topproducts);
      //console.log(topproducts.length);
      var topitemgraph = new Array(topproducts.length);
      for(item = 0; item < topproducts.length; item++){
        topitemgraph[item] = new Array( $scope.lineticks.length);
      }

      topproducts.forEach(function(elem, index){
        //console.log(index);

        var count = 0;
        for (i = 0; i < result.toplist.length; i++) {
          if(elem == result.toplist[i].productname){
            topitemgraph[index].push([count, result.toplist[i].total]);
            //console.log(result.toplist[i], count);
            count++;
            continue;;
          }
        }
      });
      console.log(topitemgraph.length);



      for(graphindex = 0 ;graphindex< topitemgraph.length;graphindex++  ){
        $scope.itemgraph.push({ data: topitemgraph[graphindex], label: topproducts[graphindex], points: { show: true }, lines: { show: true, fill: true, fillColor: { colors: [{ opacity: 0.1 }, { opacity: 0.1}] } } });
      }


      $scope.productlist = result.itemlist;
      console.log(result.itemlist);
    });
  };
  //console.log(startday);
  getMonetization(startday.format('YYYY-MM-DD'), endday.format('YYYY-MM-DD'), 'ko');


  // daterangepicker
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