app.controller('DatabrowserCtrl', ['$scope', 'databrowsers', '$window', '$state', function($scope, databrowsers, $window, $state) {

    if ($scope.currentproject == undefined) {
        $window.alert('프로젝트를 선택해주십시오.');
        $state.go('app.dashboard-v1');
        return;
    }

    databrowsers.getClasses("", "", $scope.currentproject.applicationkey).then(function(datas){
        console.log(datas);

        var folds = [
        {name:'Users', filter:''},
        {name:'Installation', filter:'Installation'}
        ];

        datas.forEach(function(element){
            if(!(element == 'Users' || element == 'Installation')) {
                var x = {};
                x.name = element;
                x.filter = element;
                folds.push(x);
            }
        });

        $scope.folds = folds;
    });


  $scope.addLabel = function(){
    $scope.labels.push(
      {
        name: $scope.newLabel.name,
        filter: angular.lowercase($scope.newLabel.name),
        color: '#ccc'
      }
    );
    $scope.newLabel.name = '';
  };

  $scope.labelClass = function(label) {
    return {
      'b-l-info': angular.lowercase(label) === 'angular',
      'b-l-primary': angular.lowercase(label) === 'bootstrap',
      'b-l-warning': angular.lowercase(label) === 'client',
      'b-l-success': angular.lowercase(label) === 'work'      
    };
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
app.directive('labelColor', function(){
    return function(scope, $el, attrs){
        $el.css({'color': attrs.color});
    }
});