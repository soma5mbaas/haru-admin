/**
 * Created by pheadra on 10/31/14.
 */

app.controller('QNACtrl', ['$scope', 'qnas', function($scope, qnas) {
    $scope.questions = [];
    $scope.comment = [];

    var getQuestionList = function() {
        qnas.getQuestionList($scope.user.currentproject.applicationkey).then(function (result) {
            $scope.questions =result.return;

            console.log(result);
        });
    }
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