'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', '$timeout', 'UserService','$localStorage',
    function($scope,   $http,   $state,   $timeout,   UserService, $localStorage) {
        $scope.authError = null;

        $scope.FacebookLogin = function(){
            UserService.FacebookLogin();
        };
        $scope.GoogleLogin = UserService.GoogleLogin;

        $scope.weblogin = function() {
            var token = $('meta[name=csrf-token]').attr('content');
            UserService.Login($scope.user.email, $scope.user.password, token).then(function(data){
                $scope.authError = "";

                // $scope.$emit('Signin', data);
                $scope.user.authuser = data.user;
                $scope.user.projects = data.projects;
                $localStorage.auth = {'token':data.user.token, 'provider':data.user.provider};

                if(data.projects.length == 0){
                    $state.go('access.project');
                } else {
                    $state.go('app.projects');
                }
            },function(data) {
                $scope.authError = data.error;
            });
        };

        $scope.weblogout = function() {
            UserService.Logout($scope.user.authuser.provider);
            $scope.user.authuser = {};
            $scope.user.projects = {};
            $scope.user.currentproject = {};
            $scope.user = {};

            delete $localStorage.auth;
            delete $sessionStorage.currentproject;
        };

    }])
;
