'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', 'UserService', '$localStorage',
        function($scope,   $http,   $state,   UserService,   $localStorage) {
            $scope.authError = null;

            $scope.signup = function() {
                var token = $('meta[name=csrf-token]').attr('content');
                UserService.Signup($scope.user.name, $scope.user.email, $scope.user.password, token).then(function(data){
                    $scope.authError = "";
                    $scope.user.authuser = data;

                    $localStorage.auth = {'token':data.token, 'provider':data.provider};
                    $state.go('access.project');
                    //$scope.$emit('Signup', data);
                },function(data) {
                    $scope.authError = data.error;
                });
            };
        }])
 ;