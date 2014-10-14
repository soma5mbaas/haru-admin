'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])
.factory('safeApply', [function() {
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
}])
.provider('crypt', [function() {
	var secretkey = '';
    this.setSecret = function (s) {
        secretkey = s;
    };

    this.$get = function () {
        var secret = secretkey;
        return {
            encrypt: function (object) {
                var message = JSON.stringify(object);
                return CryptoJS.TripleDES.encrypt(message, secret).toString();
            },
            decrypt: function (encrypted) {
                var decrypted = CryptoJS.TripleDES.decrypt(encrypted, secret);
                return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            }
        }
    };

}]);
