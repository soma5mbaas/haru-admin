'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])
.factory('safeApply', [function($rootScope) {
    return function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
             if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            if (fn) {
                $scope.$apply(fn);
            }
        }
    }
}]);



