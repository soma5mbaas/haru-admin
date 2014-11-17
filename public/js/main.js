'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$rootScope', '$scope', '$translate', '$localStorage', '$sessionStorage', '$window', '$state', 'UserService', 'crypt', 'toaster', '$socket', '$q', '$http',
    function(              $rootScope,   $scope,   $translate,   $localStorage,   $sessionStorage,   $window,   $state,   UserService,   crypt,   toaster, $socket, $q, $http ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'Plugy.io',
        version: '1.0.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info: '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger: '#f05050',
          light: '#e8eff0',
          dark: '#3a3f51',
          black: '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      };

      // save settings to local storage
      if (angular.isDefined($localStorage.settings)) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function () {
        if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = {isopen: false};
      $scope.langs = {en: 'English', ko_KR: 'Korean'}; //de_DE:'German', it_IT:'Italian', };
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function (langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice($window) {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

      // initalize object
      $scope.user = {};
      $scope.user.authuser = {};
      $scope.user.projects = {};
      $scope.user.currentproject = {};

      if ($localStorage.auth &&
          $localStorage.auth.token !== '') {
        var authtoken = $localStorage.auth.token;
        var csrftoken = $('meta[name=csrf-token]').attr('content');

        if ($localStorage.auth.provider == 'WEB') {
          UserService.UserInfo(csrftoken, authtoken).then(function (data) {
            $scope.user.authuser = data.user;
            $scope.user.projects = data.projects;
            $scope.$broadcast('loadproject', data.projects);
            //console.log($scope.user.currentproject);
          }, function (error) {
            console.log(error);
          });
        }

        if ($sessionStorage.currentproject != undefined) {
          $scope.user.currentproject = crypt.decrypt($sessionStorage.currentproject);
        }
      }

      $rootScope.$on('Facebook:statusChange', function (ev, data) {
        //console.log('Facebook Status: ', JSON.stringify(data));

        if (data.status == 'connected') {
          var token = $('meta[name=csrf-token]').attr('content');
          UserService.FacebookMe(token, data.authResponse.accessToken).then(function (data) {
            //console.log(data);

            //$scope.user = {};
            $scope.user.authuser = data.user;
            $scope.user.projects = data.projects;
            $scope.$broadcast('loadproject', data.projects);
          }, function (data) {
            console.log(data);
          });

          $localStorage.auth = {'token': data.authResponse.accessToken, 'provider': 'FACEBOOK'};
          if ($state.current.name == 'access.signin') {
            $state.go('app.projects');
          }
        }
      });

      $rootScope.$on('GooglePlus:statusChange', function (ev, data) {
        //  console.log('Google Status: ', data);

        if (data.status == 'connected') {
          csrftoken = $('meta[name=csrf-token]').attr('content');
          UserService.GoogleMe(csrftoken, data.access_token).then(function (data) {
            $scope.user.authuser = data.user;
            $scope.user.projects = data.projects;
            $scope.$broadcast('loadproject', data.projects);
            if (data.projects.length == 0) {
              $state.go('access.project');
            }
          }, function (data) {
            console.log(data);
          });

          $localStorage.auth = {'token': data.access_token, 'provider': 'GOOGLE'};
        } else if (data.status == 'loggin') {
          csrftoken = $('meta[name=csrf-token]').attr('content');
          UserService.GoogleMe(csrftoken, data.access_token).then(function (data) {
            $scope.user.authuser = data.user;
            $scope.user.projects = data.projects;
            $scope.$broadcast('loadproject', data.projects);
            if (data.projects.length == 0) {
              $state.go('access.project');
            }
          }, function (data) {
            console.log(data);
          });

          $localStorage.auth = {'token': data.access_token, 'provider': 'GOOGLE'};
          if ($state.current.name == 'access.signin') {
            $state.go('app.projects');
          }
        }
      });


      /*check facebook sdk load complete*/
      $scope.$watch(function () {
            return UserService.FacebookIsReady();
          },
          function (newVal) {
            if (newVal)
              $scope.facebookReady = true;
          }
      );

      /*check googleplus sdk load complete*/
      $scope.$watch(function () {
            return UserService.GooglePlusIsReady();
          },
          function (newVal) {
            if (newVal)
              $scope.googleplusReady = true;
          }
      );


      $scope.Logout = Logout;
      $scope.$on('Logout', function (event) {
        event.stopPropagation();

        Logout();
      });

      function Logout() {
        UserService.Logout($scope.user.authuser.provider);
        $scope.user.authuser = {};
        $scope.user.projects = {};
        $scope.user.currentproject = {};
        $scope.user = {};

        delete $localStorage.auth;
        delete $sessionStorage.currentproject;

        $state.go('access.signin');
      }


      // select project
      $scope.selectproject = function (index) {
        if ($scope.user.projects.length >= index) {
          $scope.user.currentproject = $scope.user.projects[index];

          $sessionStorage.currentproject = crypt.encrypt($scope.user.currentproject);

          $socket.send("change", $scope.user.currentproject.applicationkey);

          getLatestQnR($scope.user.currentproject.applicationkey).then(function(result){
            $scope.LatestRnQ = result;
          });
        }
      };


      $scope.toaster = {
        type: 'note',
        title: 'Title',
        text: 'Message'
      };

      $scope.pop = function () {
        toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
      };


      $socket.on("open", function (event, data) {
        // process the data here
        //console.log(event, data);
        if ($scope.user.currentproject != undefined && $scope.user.currentproject.applicationkey != undefined && $scope.user.currentproject.applicationkey != '') {
          $socket.send("messgae", $scope.user.currentproject.applicationkey);
        }
      });

      $socket.on("close", function (event, data) {
        // process the data here
        console.log(event, data);
      });

      $socket.on("message", function (event, data) {
        // process the data here
        console.log(event, data);

        if (data.appid == $scope.user.currentproject.applicationkey) {
          console.log(data.appid);

          if (data.type == 'crawler') {
            toaster.pop('note', '리뷰 수집', '리뷰 수집이 완료되었습니다.');
          } else if (data.type == 'qna') {
            toaster.pop('note', 'Q&A', '질문...');
          }
          $scope.LatestRnQ.splice(0, 1);

          $scope.LatestRnQ.push({content: "Review Crawler Complete",messagetype: "crawler",time: 1416194690})
        } else {
          console.log(data.appid);
        }

      });

      var getLatestQnR = function(applicationkey){
        var csrf = angular.element(document.querySelector('meta[name=csrf-token]')).context.content;

        var param = {'csrf-token':csrf, 'appid': applicationkey};

        var url = '/webhook/info';
        var deferred = $q.defer();
        $http({url:url,
          method:'GET',
          params:param,
          headers:{'Application-Id':applicationkey, 'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(function(response) {
              deferred.resolve(response.data);
            }, function(x) {
              deferred.reject({ error: "Server Error" });
            });
        return deferred.promise;
      };

      $scope.LatestRnQ = [];

      if($scope.user.currentproject != undefined
          && $scope.user.currentproject.applicationkey != undefined) {

        getLatestQnR($scope.user.currentproject.applicationkey).then(function(result){
          $scope.LatestRnQ = result;
        });

      }

    }]);