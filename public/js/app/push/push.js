app.controller('PushCtrl', ['$scope', function($scope) {
  $scope.folds = [
    {name: 'All', filter:''},
    {name: 'Everyone', filter:'Everyone'},
    {name: 'Unique', filter:'Unique'},
      {name: 'Channels', filter:'Channels'},
      {name: 'Segments', filter:'Segments'}
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

app.controller('PushListCtrl', ['$scope', 'pushs', '$stateParams', 'pushlists', function($scope, pushs, $stateParams, pushlists) {

  $scope.reddit = new pushlists();



}]);

app.controller('PushDetailCtrl', ['$scope', 'pushs', '$stateParams', function($scope, pushs, $stateParams) {
    pushs.get($stateParams.mailId).then(function(mail){
    $scope.mail = mail;
  })
}]);
/*
app.controller('PushNewCtrl', ['$scope', function($scope) {
    console.log('PushNewCtrl');


    $scope.sendtimelists = ['Now','Specific time', 'Timezone Specific time'];
    $scope.sendtime = $scope.sendtimelists[0];

    $scope.expirationlists = ['Never', 'After Interval'];
    $scope.expiration = $scope.expirationlists[0];


    // send type
    $scope.sendtypelist = ['Everyone','Unique', 'Channels', 'Segments'];
    $scope.sendtype = $scope.sendtypelist[0];

    $scope.uniquetypelist = ['DeviceToken','Email', 'UserId'];
    $scope.uniquetype = $scope.uniquetypelist[0];


    $scope.list_of_string = [];
    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': ['tag1', 'tag2', 'tag3', 'tag4']  // Can be empty list.
    };

    $scope.segmenttype= ['DeviceType', 'TimeZone', 'Channels', 'createdAt', 'updatedAt','AppName', 'AppIdentifier', 'AndroidVersion', 'HaruVersion', 'AppVersion'];
    $scope.segmentcondition= ['Equals', 'NotEquals'];

    $scope.segments = [
        { segmenttype: 'DeviceType', segmentcondition: 'Equals', segmentvalue:'' }
    ];

    $scope.addSegments = function() {
        $scope.segments.push( { segmenttype: 'DeviceType', segmentcondition: 'Equals', segmentvalue:'' });
    };

    $scope.close = function(index) {
        $scope.segments.splice(index, 1);
    };



}]);
*/
angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});