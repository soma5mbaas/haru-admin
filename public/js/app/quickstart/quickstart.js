/**
 * Created by pheadra on 11/15/14.
 */
app.controller('QuickstartCtrl', ['$scope', '$state', '$window', function($scope, $state, $window) {
    //$scope.quickstart.select = '';

    $scope.steps={percent:20, step1:true, step2:false, step3:false};


    $scope.quickstart = {};
    $scope.quickstart.select = "1";


    $scope.selectproduct = "1";
    $scope.product = [{url:'/img/data.png', text:"data", value:"1", selected:true},
        {url:'/img/push.png', text:"push",value:"2", selected:false},
        {url:'/img/analytics.png', text:"analytics", value:"3",selected:false},
        {url:'/img/social.png', text:"social", value:"3",selected:false}];

    $scope.clickProduct = function(index){
        console.log(index);

        $scope.product.forEach(function(elem){
            elem.selected = false;
        });
        index.selected =true;
        $scope.selectproduct = index.value;
        console.log($scope.selectproduct);
    };


    $scope.selectplatform = "1";
    $scope.platform = [{url:'/img/android.png', text:"Android", value:"1", selected:true},
        {url:'/img/apple.png', text:"IOS", value:"2", selected:false},
        {url:'/img/rest.png', text:"Restful API", value:"3",selected:false}];
    $scope.clickPlatform = function(index){
        console.log(index);

        $scope.platform.forEach(function(elem){
           elem.selected = false;
        });
        index.selected =true;
        $scope.selectplatform = index.value;
        console.log($scope.selectplatform);
    };

    $scope.selectTypeProject = "1";
    $scope.project = [{url:'/img/icon_new_project.png', text:"new project", value:"1", selected:true},
        {url:'/img/icon_existing_project.png', text:"existing project", value:"2", selected:false}];
    $scope.clickProject = function(index){
        console.log(index);

        $scope.project.forEach(function(elem){
            elem.selected = false;
        });
        index.selected =true;
        $scope.selectTypeProject = index.value;
        console.log($scope.selectTypeProject);
    };


    $scope.clickfinish = function(){
        $scope.steps.percent=100;
        console.log('finish');

        console.log( $scope.selectproduct);
        console.log( $scope.selectplatform);
        console.log( $scope.selectTypeProject);

        if($scope.selectplatform == '1'){
           if($scope.selectTypeProject == "1"){
               $state.go('app.android1');
           } else if($scope.selectTypeProject == "2"){
               $state.go('app.android2');
           }
        } else if($scope.selectplatform == '2'){
            $window.alert('comming soon');
        } else if($scope.selectplatform == '3'){
            $window.alert('comming soon');

        }
    }



}]);
/*

app.controller('QuickstartStep1Ctrl', ['$scope', '$state', '$window', function($scope, $state, $window) {


    $scope.nextbtn = function(){
        console.log('test');
        $scope.steps.step2=true;

        console.log($scope.quickstart.select);
    };

    $scope.init = function()
    {
        // I'd like to run this on document ready
        angular.element(document.querySelector('select')).imagepicker();
    }
    $scope.init();
}]);*/
