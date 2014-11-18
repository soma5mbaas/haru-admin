/**
 * Created by pheadra on 10/31/14.
 */

app.controller('QNACtrl', ['$scope', 'qnas', '$state', '$window', 'toaster', function($scope, qnas, $state, $window, toaster) {

    if(isEmpty($scope.user.currentproject)){
        //$window.alert('project를 선택해 주십시오!!!');
        toaster.pop('note', 'Select Project', '프로젝트를 선택해주세요.');

        console.log($scope.user.currentproject, $state.current.name);
        $state.go('app.projects');
    }
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    $scope.questions = [];
    $scope.comment = [];

    var getQuestionList = function() {
        qnas.getQuestionList($scope.user.currentproject.applicationkey).then(function (result) {
            $scope.questions =result.return;

            console.log(result);
        });
    };
    getQuestionList();

    $scope.deleteQna = function(index){
        console.log(index);
        var id = $scope.questions[index].Id;

        qnas.deleteQna($scope.user.currentproject.applicationkey, id).then(function(result){
            getQuestionList();
        });
    };
    $scope.addComment = function(index){
        console.log(index);
        var id = $scope.questions[index].Id;

        qnas.addComment($scope.user.currentproject.applicationkey, id, $scope.comment[index]).then(function(result){
            getQuestionList();
        });
    };

}]);