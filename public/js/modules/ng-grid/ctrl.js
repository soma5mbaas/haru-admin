app.controller('GridDemoCtrl', ['$scope', '$http', '$stateParams', 'databrowsers', function($scope, $http, $stateParams, databrowsers) {

    if($stateParams.fold == ''){
        $scope.fold = 'Users'
    } else {
        $scope.fold = $stateParams.fold;
    }

    $scope.fold = 'Users';

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };

    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 250, 500, 1000],
        pageSize: 10,
        currentPage: 1
    };

    if($scope.user != undefined) {
        appkey = $scope.user.currentproject.applicationkey;
    }

    (function() {

        console.log(appkey);
        if ($scope.user.currentproject != null) {

            databrowsers.getSchemas("", "", appkey, $scope.fold).then(function (datas) {
                var columnDefs = [
                    {field: '_id', displayName: 'EntityId', enableCellEdit: false}
                ];

                function isEmpty(obj) {
                    return Object.keys(obj).length === 0;
                }

                if (!isEmpty(datas)) {
                    console.log('getSchemas', datas);

                    schemakeys = Object.keys(datas);
                    schemakeys = schemakeys.sort();

                    schemakeys.forEach(function (elem) {
                        if (!(elem == '_id' || elem == 'updateAt' || elem == 'createAt')) {

                            var field = {};
                            field.field = elem;
                            field.displayName = elem;
                            columnDefs.push(field);
                        }
                    });
                }
                columnDefs.push({field: 'createAt', displayName: 'createAt', enableCellEdit: false});
                columnDefs.push({field: 'updateAt', displayName: 'updateAt', enableCellEdit: false});

                $scope.columnDefs = columnDefs;
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            });
        }
    })();


    $scope.setPagingData = function(data, page, pageSize){  
        pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;

        console.log($scope);
        if ($scope.$$phase != null && !$scope.$$phase) {
            $scope.$apply();
        }
    };


    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();

                $http({url:'http://stage.haru.io:10100/1/classes/' + $scope.fold,
                    method:'GET',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded', 'Application-Id':appkey}})
                    .then(function(response) {
                        data = response.data.results.filter(function(item) {
                                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                                });
                       // $scope.setPagingData(data, page, pageSize);
                    }, function(x) {
                    });
            } else {
                $http({url:'http://stage.haru.io:10100/1/classes/' + $scope.fold,
                    method:'GET',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded', 'Application-Id':appkey}})
                    .then(function(response) {
                        console.log(response.data.results);
                        $scope.setPagingData(response.data.results, page, pageSize);
                    }, function(x) {
                    });
            }
        }, 100);
    };

    //

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.$on('ngGridEventEndCellEdit', function (event) {
        var url = 'http://stage.haru.io:10200/1/classes/GameObject/' + event.targetScope.row.entity._id;
        console.log(url);

        var data = event.targetScope.row.entity;
        $http({url:url,
            method:'PUT',
            data:data,
            headers:{'Application-Id':'76071388-2e99-4379-93f6-7ea5b9e6550d'}})
            .then(function(response) {

            }, function(x) {

            });
    });

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        enableCellEdit: true,
        showSelectionCheckbox:true,

        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        checkboxCellTemplate:'<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
        sortInfo:{ fields: ['updateAt'], directions: ['desc'] },
        columnDefs:'columnDefs'
    };

    $scope.gridOptions.afterSelectionChange = function(rowItem){
        console.log(rowItem);

    };

}]);