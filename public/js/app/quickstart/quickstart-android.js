/**
 * Created by pheadra on 11/15/14.
 */
app.controller('QuickStartAndroidCtrl', ['$scope', '$state', '$window', 'quickstarts', function($scope, $state, $window, quickstarts) {

    $scope.visible = false;
    $scope.errorvisible = false;
    $scope.results = {};

    $scope.testSdk = function(){
        quickstarts.testData($scope.user.currentproject.applicationkey).then(function(result){
            console.log(result);
            if(result.count >= 1){
                $scope.results = result.results[0];
                $scope.visible = true;
                $scope.errorvisible = false;
            } else {
                $scope.visible = false;
                $scope.errorvisible = true;
            }
        });
    }
}]);
