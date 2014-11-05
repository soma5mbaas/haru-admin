/**
 * Created by pheadra on 10/31/14.
 */
app.controller('ReviewCtrl', ['$scope', 'reviews', function($scope, reviews) {
    $scope.htmlVariable = 'test';

    $scope.reviews = [];

    $scope.market = 'playGoogle';

    var getNoticeList = function(market) {
        reviews.getReviewList($scope.user.currentproject.applicationkey, market).then(function (result) {
            $scope.reviews =result;

            console.log(result);
        }, function(result){
            console.log(result);
            getNoticeList($scope.market);
        });
    }
    getNoticeList($scope.market);


    $scope.reviewReflash = function(market){
      console.log(market);
        $scope.market = market;
        getNoticeList($scope.market);
    };

}]);