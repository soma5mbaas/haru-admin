app.controller('GridDemoCtrl', ['$rootScope', '$scope', '$http', '$stateParams', 'databrowsers', '$modal', '$log', '$state', 'server_url',
                        function($rootScope, $scope, $http, $stateParams, databrowsers, $modal, $log, $state, server_url) {
    console.log('GridDemoCtrl');
    if($stateParams.fold == ''){
        $scope.fold = 'Users'
    } else {
        $scope.fold = $stateParams.fold;
    }

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };

    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [100, 250, 500, 1000],
        pageSize: 100,
        currentPage: 1
    };


    $scope.statuses = [true, false];
    $scope.booleanCellSelectEditableTemplate = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options="value for value in statuses"  ng-change="update(this)"/>';

    $scope.update = function(event){
        console.log('update', event);
    };

    $scope.editcellstyle = {'width':'98%', 'border-color':'#23b7e5'};
    $scope.numberCellEditableTemplate = "<input ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-model=\"COL_FIELD\" ng-change=\"updateNumberEntity(col, row, row.getProperty(col.field))\" ng-style=\"editcellstyle\"/>";
    $scope.updateNumberEntity = function(col, row, property) {
        console.log(col, row, property);
        console.log(this);

        if(isNumber(property)){
            $scope.editcellstyle = {'width':'98%', 'border-color':'#23b7e5'};
        } else {
            $scope.editcellstyle =  {'width':'98%', 'border-color':'#f05050'};
        }
    };
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


    var columnnames = [];

    var getSchema = function() {
        if($scope.user != undefined) {
            appkey = $scope.user.currentproject.applicationkey;
        }
        console.log("getSchema", appkey,  $scope.fold);
        if ($scope.user.currentproject != null) {

            databrowsers.getSchemas("", "", appkey, $scope.fold).then(function (datas) {
                var columnDefs = [
                    {field: '_id', displayName: 'EntityId(objectid)',width:220, enableCellEdit: false}
                ];

                function isEmpty(obj) {
                    return Object.keys(obj).length === 0;
                }

//                columnnames = ['_id','createdAt','updatedAt', 'ACL'];
                columnnames = [];
                if (!isEmpty(datas)) {
                    $scope.schema = datas;

                    schemakeys = Object.keys(datas);
                    schemakeys = schemakeys.sort();

                    schemakeys.forEach(function (elem) {
                        if (!(elem == '_id' || elem == 'updatedAt' || elem == 'createdAt' || elem == 'ACL' || elem == 'password')) {

                            var field = {};
                            field.field = elem;
                            field.displayName = elem + "(" + datas[elem] + ")";
                            field.width=150;
                            if(datas[elem] == 'boolean'){
                                console.log(datas[elem]);

                                field.editableCellTemplate = $scope.booleanCellSelectEditableTemplate;
                            } else if (datas[elem] == 'number') {
                                field.editableCellTemplate = $scope.numberCellEditableTemplate;
                            }
                            columnDefs.push(field);
                            columnnames.push(elem);
                        }
                    });
                }
                columnDefs.push({field: 'createdAt', displayName: 'createdAt(date)', enableCellEdit: false, width:150,cellTemplate: '<div>{{row.entity[col.field] | date:"yyyy-MM-dd HH:mm:ss"}}</div>'});
                columnDefs.push({field: 'updatedAt', displayName: 'updatedAt(date)', enableCellEdit: false, width:150,cellTemplate: '<div>{{row.entity[col.field] | date:"yyyy-MM-dd HH:mm:ss"}}</div>'});
                columnDefs.push({field: 'ACL', displayName: 'ACL(ACL)', width:150, enableCellEdit:false});

                $scope.columnDefs = columnDefs;
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            });
        }
    };
    getSchema();

    $scope.$watch('user.currentproject', function(){
        getSchema();
    });



    $scope.setPagingData = function(data, page, pageSize){  
        pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;

        if ($scope.$$phase != null && !$scope.$$phase) {
            $scope.$apply();
        }
    };


    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();

                $http({url:server_url + '/1/classes/' + $scope.fold,
                    method:'GET',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded', 'Application-Id':appkey}})
                    .then(function(response) {
                        console.log(response);

                        data = response.data.results.filter(function(item) {
                                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                                });
                       // $scope.setPagingData(data, page, pageSize);
                    }, function(x) {
                    });
            } else {
                $http({url:server_url + '/1/classes/' + $scope.fold,
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

    $scope.$on('ngGridEventStartCellEdit', function(event){
        $scope.oldrow ={};
        angular.extend($scope.oldrow, event.targetScope.row.entity);
    });

    $scope.$on('ngGridEventEndCellEdit', function (event) {
        console.log('ngGridEventEndCellEdit');
        var url = server_url + '/1/classes/' +$scope.fold+'/' + event.targetScope.row.entity._id;
        //console.log(event.targetScope.row.entity);

        data = {};
        angular.extend(data, event.targetScope.row.entity);
        console.log(data);

        angular.forEach($scope.schema,function(value,index){
            if(value == 'number'){
                var convertnumber = Number(data[index]);
                if(isNaN(convertnumber)){
                   event.targetScope.row.entity[index] = $scope.oldrow[index];
                   delete data[index];
                }else {
                    data[index] = convertnumber;
                }
            }
        });
        console.log(url, data);

        $http({url:url,
            method:'PUT',
            data:data,
            headers:{'Application-Id':$scope.user.currentproject.applicationkey}})
            .then(function(response) {
                console.log(response);

            }, function(x) {

            });
    });

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        enableColumnResize: true,
        enableCellEdit: true,
        showSelectionCheckbox:true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        checkboxCellTemplate:'<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
        sortInfo:{ fields: ['updateAt'], directions: ['desc'] },
        columnDefs:'columnDefs'
    };

    var selectlist = [];
    $scope.gridOptions.afterSelectionChange = function(rowItem){
        console.log(rowItem);

        if(rowItem.selected) {
            selectlist.push(rowItem.entity._id);
        } else {
            selectlist.splice(selectlist.indexOf(rowItem.entity._id), 1);
        }


        console.log(selectlist);
        console.log( $scope.myData );
    };

    $scope.deleteRows = function(){
        var deletewhere = '{"where": {"_id": {"$in":'  + JSON.stringify(selectlist) + ' } } }';
        console.log(deletewhere);
        databrowsers.deleteRows($scope.user.currentproject.applicationkey, $scope.fold, deletewhere).then(function(result){
            console.log(result);
            getSchema();
        }, function(x){
            console.log('test error');
        });

        //{"where": {"_id": {"$in": ["2c663306-5f16-4ad4-bca2-85503e91c148"] } } }
        //console.log(deletewhere);
    };
    $scope.deleteAllRows = function() {
        console.log("deleteAllRows");
        //'{"where": {} }'

        var alldelete = '{"where": {} }';
        databrowsers.deleteRows($scope.user.currentproject.applicationkey, $scope.fold, alldelete).then(function(result){
            console.log(result);
            getSchema();
        }, function(x){
            console.log('test error');
        });
    };

    $scope.addRow = function(){
        databrowsers.addRow($scope.user.currentproject.applicationkey, $scope.fold ).then(function (datas) {
            console.log(datas);
            $scope.myData.push(datas);
        }, function (error) {
            console.log(error);
        });
    };

    $scope.dropClass = function(){
        console.log("deleteClasses");
        databrowsers.deleteClasses($scope.user.currentproject.applicationkey, $scope.fold).then(function(result){
            $rootScope.$emit('deleteclass', undefined);

            $state.go('app.databrowser.list', {fold:'', update:true});

        }, function(x){
            console.log('test error');
        });

    };

    $scope.exportClass = function(){
        console.log($scope.fold);
        databrowsers.exportClass($scope.user.currentproject.applicationkey, $scope.fold, 'haruiodev@gmail.com').then(function(result){
           console.log(result);
        });

    };

    $scope.refreshlist = function(){
        getSchema();
    };


    $scope.opendeletecolumn = function(size){
        $scope.type.columnnames = columnnames;

        var modalInstance = $modal.open({
            templateUrl: 'myColumnModalContent.html',
            controller: 'ColumnDeleteModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.type;
                }
            }
        });

        modalInstance.result.then(function (column) {
            // TODO : add schema  & update
            var deletecolumn = '{"column": "'+column+'" }';
            databrowsers.deleteRows($scope.user.currentproject.applicationkey, $scope.fold, deletecolumn).then(function(result){
                getSchema();
            }, function(x){
                console.log('test error');
            });
            console.log(column);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }



    $scope.type = {};
    $scope.type.items =['string', 'number', 'boolean', 'date', 'file', 'geopoint', 'array', 'object', 'pointer', 'relation'];
    $scope.open = function (size) {
        $scope.type.columnnames = columnnames;

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ColumnModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.type;
                }
            }
        });

        modalInstance.result.then(function (column) {
            // TODO : add schema  & update
            databrowsers.addSchemas("", "", appkey, $scope.fold, column.columnname, column.columntype).then(function (datas) {
                console.log(datas);
                getSchema();
            }, function(error){

            });

            console.log(column);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



}]);
/*
app.controller('DatabrowserModelCtrl', ['$scope', '$http', '$stateParams', 'databrowsers', '$modal', '$log',
                        function($scope, $http, $stateParams, databrowsers, $modal, $log) {
    console.log("DatabrowserModelCtrl");

}]);*/