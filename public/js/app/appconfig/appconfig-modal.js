/**
 * Created by pheadra on 10/31/14.
 */
app.controller('AppConfigModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.items = items;

    $scope.parameter = {};
    $scope.parameter.parametertype = items.items[0];


    $scope.ok = function () {
        $modalInstance.close($scope.parameter);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);