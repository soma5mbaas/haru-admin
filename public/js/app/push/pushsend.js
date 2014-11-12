
app.controller('PushNewCtrl', ['$scope', '$state', '$window', 'pushs', function($scope, $state, $window, pushs) {



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
        'tags': ['channel1', 'channel2', 'channel3', 'channel4']  // Can be empty list.
    };

    // segments
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

    // message key/value
    $scope.messagekvs = [
        { key: '', value: ''}
    ];

    $scope.addMessagekvs = function() {
        $scope.messagekvs.push(  { key: '', value: ''});
    };

    $scope.messagekbClose = function(index) {
        $scope.messagekvs.splice(index, 1);
    };


    // DatePicker
    $scope.today = function() {
        $scope.spdate = new Date();
    };
    $scope.today();
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy/MM/dd';

    // Time Picker
    $scope.sptime = new Date();
    $scope.changed = function () {
        var monentval = moment.utc($scope.spdate).hour($scope.sptime.getHours()).minute($scope.sptime.getMinutes()).second($scope.sptime.getSeconds());

        console.log('Time changed to: ' + monentval);
    };
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };



    $scope.$watch('radioModel', function(newVal) {
          if(newVal == '1'){
              $scope.message = '';
          } else if (newVal == '2'){

          } else if (newVal == '3'){
              $scope.message = '{}';
          }

    });

    //messagetype 1:text, 2:keyvalue, 3:json
    $scope.$watch('message', function(newVal) {

        if($scope.messagetype == '0'){
            if($scope.message != undefined && $scope.message != ''){
                $scope.jsonmessage = '{"message":"' +  $scope.message + '"}';
            } else {
                $scope.jsonmessage = '';
            }
        } else if ($scope.message == '1'){

        } else if ($scope.messagetype == '2'){
            $scope.jsonmessage  = $scope.message;
        }
    });
    $scope.$watch('messagekvs',function(newVal){
        if(newVal.length != 1 || newVal[0].key != '') {
            var str = '';
            str= "{";
            newVal.forEach(function(elem, index, array){
                console.log(elem.key, elem.value);
                if(elem.key != ''){
                    str += "'" +elem.key + "':'" + elem.value + "', ";
                }
            });
            console.log(str);
            str = str.substring(0, str.length-2);
            console.log(str);

            str += "}";
            $scope.jsonmessage = str;

            console.log($scope.jsonmessage);
        }


    }, true);



    $scope.sendpush = function(){
        var token = $('meta[name=csrf-token]').attr('content');

        var wherevalue = {};
        var pushsendtype = 0;
        if($scope.sendtype == 'Everyone' ){
            wherevalue = '';
            pushsendtype = 0;
        } else if ($scope.sendtype == 'Unique' ) {
            wherevalue[$scope.uniquetype] = $scope.uniquevalue;
            pushsendtype = 1;
        } else if ($scope.sendtype == 'Channels' ) {
            wherevalue = $scope.list_of_string;
            pushsendtype = 2;
        } else if ($scope.sendtype == 'Segments' ) {
            wherevalue = '';
            pushsendtype = 3;
        }
        var swherevalue = JSON.stringify(wherevalue);
        console.log(swherevalue);
        console.log($scope.jsonmessage);

        var sendtimeparam = '';
        if($scope.sendtime == 'Now'){
            sendtimeparam =  new Date().getTime();
        } else if($scope.sendtime == 'Specific time') {
            sendtimeparam = moment.utc($scope.spdate).hour($scope.sptime.getHours()).minute($scope.sptime.getMinutes()).second($scope.sptime.getSeconds());
        }


        if($scope.jsonmessage == undefined || $scope.jsonmessage == ''){
            $window.alert('보내시는 메시지가 없습니다.');
            return;
        }

        //$scope.expiration
        //csrftoken, authtoken, pushtype, wherevalue, message, messagetype, totalcount, sendtimezone, sendtime, expirationtime
        pushs.sendpush(token,
                       $scope.user.currentproject.applicationkey,
                       pushsendtype,
                       swherevalue,
                       $scope.jsonmessage,
                       $scope.messagetype,
                       1,
                       'Asia/Seoul',
                        sendtimeparam,
                        sendtimeparam,
                        0).then(function(result){

            //$state.go('app.push.list');
        }, function(data) {
            $scope.authError = data.error;
        });

    };
}]);
