/**
 * Created by pheadra on 10/31/14.
 */
app.controller('ReviewCtrl', ['$scope', 'reviews', '$state', '$window',
                      function($scope,   reviews,   $state,   $window) {
    if(isEmpty($scope.user.currentproject)){
      $window.alert('project를 선택해 주십시오!!!');

      console.log($scope.user.currentproject, $state.current.name);
      $state.go('app.projects');
    }
    function isEmpty(obj) {
      return Object.keys(obj).length === 0;
    }


    $scope.htmlVariable = 'test';

    $scope.reviews = [];

    $scope.market = 'playGoogle';

    var getReviewList = function(market, page, limit) {
        reviews.getReviewList($scope.user.currentproject.applicationkey, market, page, limit).then(function (result) {
            $scope.reviews =result;

            console.log(result);
        }, function(result){
            console.log(result);
            //getNoticeList($scope.market);
        });
    };
    getReviewList($scope.market, 0, 10);


    $scope.reviewReflash = function(market){
      console.log(market);
        $scope.market = market;
        getReviewList($scope.market);
    };

}]);