app.controller('PushCtrl', ['$scope', '$state', '$window', function($scope, $state, $window) {

    if(isEmpty($scope.user.currentproject)){
        $window.alert('project를 선택해 주십시오!!!');

        console.log($scope.user.currentproject, $state.current.name);
        $state.go('app.projects');
    }
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }


    $scope.folds = [
        {name: 'All', filter:''},
        {name: 'Everyone', filter:'Everyone'},
        {name: 'Unique', filter:'Unique'},
        {name: 'Channels', filter:'Channels'},
        {name: 'Segments', filter:'Segments'}
    ];

    $scope.labels = [
        {name: 'Success', filter:'Success', color:'#27c24c'},
        {name: 'Pending', filter:'Pending', color:'#7266ba'},
        {name: 'Error', filter:'Error', color:'#f05050'}
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
    var fold = $stateParams.fold;

    //0:everyone, 1:unique, 2:channels, 3:segments
    var filter ={};

    if(fold == 'Everyone'){
        filter.pushtype = 0;
    } else if(fold == 'Unique') {
        filter.pushtype = 1;
    } else if(fold == 'Channels') {
        filter.pushtype = 2;
    } else if(fold == 'Segments') {
        filter.pushtype = 3;
    } else if(fold == 'Success') {
        filter.status = 1;
    } else if(fold == 'Pending') {
        filter.status = 0;
    } else if(fold == 'Error') {
        filter.status = 2;
    }

    $scope.filterdata = filter;


    var applicationkey = '';
    if(!isEmpty($scope.user.currentproject)) {
        applicationkey = $scope.user.currentproject.applicationkey;
    }

    $scope.reddit = new pushlists(applicationkey);
    $scope.pushtype = ['Everyone', 'Unique', 'Channels', 'Segments'];

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
}]);

app.controller('PushDetailCtrl', ['$scope', 'pushs', '$stateParams', function($scope, pushs, $stateParams) {
    pushs.get($stateParams.mailId).then(function(mail){
        $scope.mail = mail;
    }, function (error) {
        console.log(error);
    })
}]);

angular.module('app').directive('labelColor', function(){
    return function(scope, $el, attrs){
        $el.css({'color': attrs.color});
    }
});