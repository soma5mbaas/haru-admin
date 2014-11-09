app.controller('DatabrowserCtrl', ['$rootScope', '$scope', 'databrowsers', '$window', '$state', '$stateParams','$modal', '$log',
    function($rootScope, $scope, databrowsers, $window, $state, $stateParams, $modal, $log) {

        if(isEmpty($scope.user.currentproject)){
            $window.alert('project를 선택해 주십시오!!!');

            console.log($scope.user.currentproject, $state.current.name);
            $state.go('app.projects');
        }
        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }


        if ($scope.user == undefined || $scope.user.currentproject == undefined) {
            $window.alert('프로젝트를 선택해주십시오.');
            $state.go('app.dashboard-v1');
            return;
        }

        $rootScope.$on('deleteclass', function(event, data){
            getClasses();
        });

        $scope.$watch('user.currentproject', function(){
            getClasses();
        });

        var foldsname;
        var getClasses =function(){
            databrowsers.getClasses("", "", $scope.user.currentproject.applicationkey).then(function(datas){
                console.log(datas);

                var folds = [
                    {name:'Users', filter:''},
                    {name:'Installations', filter:'Installations'}
                ];

                foldsname = ["Users", 'Installations'];

                //schemakeys = Object.keys(datas);
                schemakeys = datas.sort();


                schemakeys.forEach(function(element){
                    if(!(element == 'Users' || element == 'Installations')) {
                        var x = {};
                        x.name = element;
                        x.filter = element;
                        folds.push(x);
                        foldsname.push(element);
                    }
                });

                $scope.folds = folds;
            });
        };
        getClasses();



        // add class modal
        $scope.open = function (size) {
            console.log("openentitymodel");
            var modalInstance = $modal.open({
                templateUrl: 'myClassesModalContent.html',
                controller: 'ClassModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return foldsname;
                    }
                }
            });

            modalInstance.result.then(function (classname) {
                // TODO : add schema  & update
                databrowsers.addClasses($scope.user.currentproject.applicationkey, classname.columnname).then(function (datas) {
                    console.log(datas);
                    getClasses();
                }, function (error) {

                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }]);
