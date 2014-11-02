/**
 * Created by pheadra on 10/31/14.
 */

app.controller('NoticeCtrl', ['$scope', 'notices', '$modal', '$log', '$state', function($scope, notices, $modal, $log, $state) {
    $scope.htmlVariable = 'test';

    $scope.notices = [];

    var getNoticeList = function() {
        notices.getNotice($scope.user.currentproject.applicationkey).then(function (result) {
            $scope.notices =result;

            console.log(result);
        });
    }
    getNoticeList();


    $scope.AddNotice = function(){
        var data = {};
        data.Title = $scope.noticeTitle;
        data.Body = $scope.noticeBody;


        console.log(data);
        notices.createNotice($scope.user.currentproject.applicationkey, data).then(function(){
            getNoticeList();
        });

        $state.go('app.helpcenter.notice');
    };

    $scope.deleteNotice = function(index){
        console.log(index);
        var id = $scope.notices[index].Id;

        //ar data = '{ "fields": ["'+ key+'"] }';
        console.log(id);
        notices.deleteNotice($scope.user.currentproject.applicationkey, id).then(function(result){
            console.log(result);
            getNoticeList();
        });
    };

}]);