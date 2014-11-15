app.controller('FileUploadCtrl', ['$scope', 'FileUploader', 'server_url', function($scope, FileUploader, server_url) {
    var uploader = $scope.uploader = new FileUploader({
        url: server_url + '/1/files',
        headers : {'Application-Id':$scope.user.currentproject.applicationkey}
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            console.log(item);
            return this.queue.length < 10;
        }
    });

    $scope.visibleimage = false;
    $scope.uploadimage = [];

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
       // console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
       // console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        //console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
        $scope.uploadimage = [];
    };
    uploader.onProgressItem = function(fileItem, progress) {
        //console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        //console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        //console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        //console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        //console.info('onCompleteItem', fileItem, response, status, headers);
        console.log(fileItem);
        $scope.uploadimage.push({url:response.results[0].originalUrl, selected:false,  size:response.results[0].originalSize, originalsize:response.results[0].originalSize, text:'Original Image', type:0});
        $scope.uploadimage.push({url:response.results[0].url, selected:true, size:response.results[0].size, originalsize : response.results[0].originalSize, text:'Covert Image', type:1});

    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');

        $scope.visibleimage = true;
    };

    console.info('uploader', uploader);

    $scope.selectimage = function(index){
      console.log(index);
        $scope.uploadimage.forEach(function(elem){
            elem.selected = false;
        })
        $scope.uploadimage[index].selected = true;
    };

    angular.element(document.querySelector('select')).imagepicker();

}]);