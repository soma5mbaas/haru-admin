/**
 * Created by pheadra on 10/31/14.
 */
app.controller('SettingEmailCtrl', ['$scope', function($scope) {

    $scope.verificationTitle = "Please verify your email for %appname%";
    $scope.verificationhtmlVariable = "Hi,<div><br/></div><div>You are being asked to confirm the email address %email% with %appname%</div><div><br/></div><div>Click here to confirm it:</div><div>%link%</div>";

    $scope.passwordTitle = "Password Reset for %appname%";
    $scope.passwordhtmlVariable = "Hi,<div><br/></div><div>You requested to reset your password for %appname%</div><div><br/></div><div>Click here to reset it:</div><div>%link%</div>";



}]);
