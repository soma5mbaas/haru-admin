/**
 * Created by pheadra on 10/31/14.
 */
app.controller('ReviewCtrl', ['$scope', 'reviews', function($scope, reviews) {
    $scope.htmlVariable = 'test';

    $scope.reviews = [];

    $scope.market = 'playGoogle';

    var getNoticeList = function(market, page, limit) {
        reviews.getReviewList($scope.user.currentproject.applicationkey, market, page, limit).then(function (result) {
            $scope.reviews =result;

            console.log(result);
        }, function(result){
            console.log(result);
            //getNoticeList($scope.market);
        });
    }
    getNoticeList($scope.market, 0, 10);


    $scope.reviewReflash = function(market){
      console.log(market);
        $scope.market = market;
        getNoticeList($scope.market);
    };

}]);