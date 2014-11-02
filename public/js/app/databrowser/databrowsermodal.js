/**
 * Created by pheadra on 10/31/14.
 */
//databrowser add class modal
app.controller('ClassModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.column = {};
    $scope.column.columnname = '';

    items.push('_id');
    items.push('createdAt');
    items.push('updatedAt');
    items.push('ACL');

    $scope.ok = function () {

        if($scope.column.columnname == undefined || $scope.column.columnname == ''){
            $scope.authError = 'empty class name!!!';
        } else if (items.indexOf($scope.column.columnname) <= 0) {
            delete $scope.authError;
            $modalInstance.close($scope.column);
        } else {
            // class name 중복
            $scope.authError = 'already exist class name!!!';
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//databrowser add column modal
app.controller('ColumnDeleteModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.items = items;

    $scope.column = {};
    $scope.column.columnname = items.columnnames[0];

    $scope.ok = function () {
        if($scope.column.columnname == undefined || $scope.column.columnname == ''){
            $scope.authError = 'Empty Column name!!!';
        } else {
            $modalInstance.close( $scope.column.columnname);
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//databrowser add column modal
app.controller('ColumnModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.items = items;

    $scope.column = {};
    $scope.column.columntype = items.items[0];
    $scope.column.columnname = '';

    $scope.ok = function () {
        if($scope.column.columnname == undefined || $scope.column.columnname == ''){
            $scope.authError = 'Empty Column name!!!';
        } else if (items.columnnames.indexOf($scope.column.columnname) <= 0) {
            delete $scope.authError;
            $modalInstance.close( $scope.column);
        } else {
            // class name 중복
            $scope.authError = 'already exist Column name!!!';
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);