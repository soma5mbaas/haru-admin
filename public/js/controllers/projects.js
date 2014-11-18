/**
 * Created by pheadra on 10/31/14.
 */
'use strict';

/* Controllers */
app.controller('ProjectsController', ['$rootScope', '$scope', '$window', '$http', '$state', '$sessionStorage', 'crypt', 'toaster', '$timeout',
    function($rootScope,   $scope,   $window,   $http,   $state,   $sessionStorage,   crypt, toaster, $timeout) {
        console.log('test');


        $timeout(function(){
            if(isEmpty($scope.user.authuser)){
                $window.alert('로그인을 해주십시오!');
                //toaster.pop('note', 'Please Login Site', '로그인을 해주세요');
                $state.go('access.signin');
            }

        }, 500);


        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }

        // $scope.user.projects
        $scope.$on('loadproject', function(event, args){
            console.log($scope.user.projects);
        });

        $scope.clickMenu = function(index, menu){
            console.log(index);

            $scope.user.currentproject = $scope.user.projects[index];
            $sessionStorage.currentproject = crypt.encrypt($scope.user.currentproject);

            if(menu == 'dashboard'){
                $state.go('app.dashboard-v1');
            } else if(menu == 'data'){
                $state.go('app.databrowser.list');
            } else if (menu == 'push') {
                $state.go('app.push.list');
            } else if (menu == 'analysis') {
                $state.go('app.monetization');
            } else if (menu == 'helpcenter') {
                $state.go('app.helpcenter.review');
            } else if (menu == 'quickstart') {
                $state.go('app.quickstart');
            } else if (menu == 'setting') {
                $state.go('app.setting.general');
            }
        };
    }])
;