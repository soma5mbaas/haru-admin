app.controller('DatabrowserCtrl', ['$rootScope', '$scope', 'databrowsers', '$window', '$state', '$stateParams','$modal', '$log',
                           function($rootScope, $scope, databrowsers, $window, $state, $stateParams, $modal, $log) {



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
/*
app.controller('DatabrowserListCtrl', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  $scope.fold = $stateParams.fold;
    console.log(mails);

    mails.all().then(function(mails){
    console.log(mails);

    $scope.mails = mails;
  });
}]);

app.controller('DatabrowserDetailCtrl', ['$scope', 'mails', '$stateParams', function($scope, mails, $stateParams) {
  mails.get($stateParams.mailId).then(function(mail){
    $scope.mail = mail;
  })
}]);

app.controller('DatabrowserNewCtrl', ['$scope', function($scope) {
  $scope.mail = {
    to: '',
    subject: '',
    content: ''
  };
  $scope.tolist = [
    {name: 'James', email:'james@gmail.com'},
    {name: 'Luoris Kiso', email:'luoris.kiso@hotmail.com'},
    {name: 'Lucy Yokes', email:'lucy.yokes@gmail.com'}
  ];
}]);




*/
