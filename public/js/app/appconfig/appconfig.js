/**
 * Created by pheadra on 10/31/14.
 */
app.controller('AppConfigCtl', ['$scope', 'appConfigs', '$modal', '$log', function($scope, appConfigs, $modal, $log) {
    $scope.params = [];

    var getparamlist = function() {
        appConfigs.getParams($scope.user.currentproject.applicationkey).then(function (result) {
            $scope.params = [];

            var parameterkey = Object.keys(result);
            parameterkey.forEach(function (elem) {


                var param = [];
                param.push(elem);
                param.push(result[elem][0]);
                param.push(result[elem][1]);

                $scope.params.push(param);
            });
            console.log($scope.params);
        });
    }
    getparamlist();

    $scope.deleteparameter = function(index){
        console.log(index);
        console.log(index);
        var key = $scope.params[index][0];

        var data = '{ "fields": ["'+ key+'"] }';
        console.log(data);
        appConfigs.deleteParam($scope.user.currentproject.applicationkey, data).then(function(){
            getparamlist();
        });
    };



    $scope.type = {};
    $scope.type.items =['string', 'number', 'boolean', 'date', 'file', 'geopoint', 'array', 'object', 'pointer', 'relation'];

    // add class modal
    $scope.addparameter = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'myParameterModalContent.html',
            controller: 'AppConfigModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.type;
                }
            }
        });

        modalInstance.result.then(function (param) {
            var data = '{ "'+param.parametername+'": ["'+param.parametertype+'","'+param.parametervalue+'"] }'
            console.log(data);
            appConfigs.AddParam($scope.user.currentproject.applicationkey, data).then(function (param) {
                getparamlist();
            }, function (error) {
                console.log(error);
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);