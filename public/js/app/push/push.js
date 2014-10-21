app.controller('PushCtrl', ['$scope', function($scope) {
  $scope.folds = [
    {name: 'All', filter:''},
    {name: 'Web', filter:'web'},
    {name: 'API', filter:'api'}
  ];

  $scope.labels = [
    {name: 'Success', filter:'angular', color:'#23b7e5'},
    {name: 'Pending', filter:'bootstrap', color:'#7266ba'},
    {name: 'Error', filter:'client', color:'#fad733'}
  ];

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
      'b-l-info': angular.lowercase(label) === 'android',
      'b-l-primary': angular.lowercase(label) === 'iphone',
      'b-l-warning': angular.lowercase(label) === 'client',
      'b-l-success': angular.lowercase(label) === 'work'      
    };
  };

}]);

app.controller('PushListCtrl', ['$scope', 'pushs', '$stateParams', function($scope, pushs, $stateParams) {
  $scope.fold = $stateParams.fold;
    pushs.all().then(function(mails){
    $scope.mails = mails;
  });
}]);

app.controller('PushDetailCtrl', ['$scope', 'pushs', '$stateParams', function($scope, pushs, $stateParams) {
    pushs.get($stateParams.mailId).then(function(mail){
    $scope.mail = mail;
  })
}]);

app.controller('PushNewCtrl', ['$scope', function($scope) {
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

angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});