/**
 * Created by pheadra on 11/5/14.
 */
// project controller
app.controller('ProjectFormController', ['$rootScope', '$scope', '$window', '$http', '$state',
    function($rootScope,   $scope,   $window,    $http,   $state) {
        $scope.authError = null;

        $scope.createproject = function() {
            var csrftoken = $('meta[name=csrf-token]').attr('content');
            var authtoken = $scope.user.authuser.token;
            var projectname = $scope.project.name;
            $scope.authError = "";


            $http({url:'project/add',
                method:'POST',
                data:'csrf-token=' + csrftoken + '&authtoken=' + authtoken + '&projectname=' + projectname,
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
                .then(function(response) {
                    if (!response.data.error) {
                        $scope.user.projects = response.data.projects;
                        $state.go('app.projects');
                    }else {
                        $scope.authError = response.data.error;
                        $window.alert(response.data.error);
                    }
                }, function(x) {
                    $scope.authError = 'Server Error';
                });
        }
    }])