'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', 'UserService', '$localStorage', '$window',
        function($scope,   $http,   $state,   UserService,   $localStorage, $window) {
            $scope.authError = null;

            $scope.signup = function() {
                var token = $('meta[name=csrf-token]').attr('content');
                UserService.Signup($scope.user.name, $scope.user.email, $scope.user.password, token).then(function(data){
                    $scope.authError = "";
                    $scope.user.authuser = data;

                    $localStorage.auth = {'token':data.token, 'provider':data.provider};


                    $window.alert('환영합니다. 회원가입되었습니다.')
                    $state.go('access.project');
                    //$scope.$emit('Signup', data);
                },function(data) {
                    $scope.authError = data.error;
                });
            };
        }])
 ;