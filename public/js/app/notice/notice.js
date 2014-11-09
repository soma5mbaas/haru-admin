/**
 * Created by pheadra on 10/31/14.
 */
app.controller('NoticeCtrl', ['$scope', 'notices', '$modal', '$log', '$state', '$window',
                      function($scope, notices, $modal, $log, $state, $window) {
    if(isEmpty($scope.user.currentproject)){
        $window.alert('project를 선택해 주십시오!!!');

        console.log($scope.user.currentproject, $state.current.name);
        $state.go('app.projects');
    }
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    $scope.htmlVariable = 'test';

    $scope.notices = [];

    var getNoticeList = function() {
        notices.getNotice($scope.user.currentproject.applicationkey).then(function (result) {
            $scope.notices =result.return;


        });
    };
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