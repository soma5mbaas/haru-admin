'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate', 'ngCookies'])
  .controller('AppCtrl', ['$rootScope', '$scope', '$translate', '$localStorage', '$sessionStorage', '$window', '$state', 'UserService', 'safeApply',
    function(              $rootScope,   $scope,   $translate,   $localStorage,   $sessionStorage,   $window,   $state,   UserService, safeApply) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'HaRu.io',
        version: '1.3.1',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: true,
          asideDock: false,
          container: false
        }
      };

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

      if($localStorage.auth &&
    	$localStorage.auth.token !== ''){
    	var authtoken = $localStorage.auth.token;
    	var csrftoken = $('meta[name=csrf-token]').attr('content');
    	UserService.UserInfo(csrftoken, authtoken).then(function(data){
    		$scope.authuser = data.user;
    		$scope.projects = data.projects;
    	});
    	
     } else {
    	$scope.authuser = {};
    	$scope.projects = {};
     }

     /*
      $rootScope.$on('Auth:statusChange', function(ev, data) {
    	  console.log('Auth Status: ', data);
    	  if (data.status == 'connected') { // login
    		  UserService.setLogin(true);
          	  UserService.setProvider('WEB');
          	  UserService.setToken(data.token);
    		  $localStorage.auth = {'token':data.token, 'provider':'WEB', 'status':'connected'};
    		  $state.go('app.dashboard-v1');
    	  } else if (data.status == 'signup')  {
    		  UserService.setLogin(true);
          	  UserService.setProvider('WEB');
    		  $localStorage.auth = {'token':data.token, 'provider':'WEB', 'status':'connected'};
    	  } else if (data.status == 'error') {
    		  $window.alert(data.error);
    	  } 
      });
      
      $rootScope.$on('Project:statusChange', function(ev, data) {
    	  console.log('Project info : ', data);
    	  if ( Object.keys(data.projects).length === 0) { // login
    		  $state.go('access.project');
    	  }
      });
      */
      
      $rootScope.$on('Facebook:statusChange', function(ev, data) {
          console.log('Facebook Status: ', JSON.stringify(data));
          
          if (data.status == 'connected') {
        	var token = $('meta[name=csrf-token]').attr('content');
        	UserService.FacebookMe(token, data.authResponse.accessToken).then(function(data){
        		console.log(data);
        		$scope.authuser = data.user;
        		$scope.projects = data.projects;
        	}, function(data){
        		console.log(data);
        	});
        	
  	        $localStorage.auth = {'token':data.authResponse.accessToken, 'provider':'FACEBOOK'};
  	        if($state.current.name == 'access.signin') {
  	        	$state.go('app.dashboard-v1');
  	        }
          }
        });

      $rootScope.$on('GooglePlus:statusChange', function(ev, data) {
          console.log('Google Status: ', data);

          if (data.status == 'connected') {
          	  csrftoken = $('meta[name=csrf-token]').attr('content');
          	  UserService.GoogleMe(csrftoken, data.access_token).then(function(data){
        		console.log(data);
        		$scope.authuser = data.user;
        		$scope.projects = data.projects;
        		
        		if(data.projects.length == 0){
        			$state.go('access.project');
        		}
        	  }, function(data){
        	  	console.log(data);
        	  });
    	      
              $localStorage.auth = {'token':data.access_token, 'provider':'GOOGLE'};
          } else if (data.status == 'loggin') {
        	  csrftoken = $('meta[name=csrf-token]').attr('content');
    	      UserService.GoogleMe(csrftoken, data.access_token).then(function(data){
        		console.log(data);
        		$scope.authuser = data.user;
        		$scope.projects = data.projects;
        		if(data.projects.length == 0){
        			$state.go('access.project');
        		}
        	  }, function(data){
        	  	console.log(data);
        	  });
    	      
              $localStorage.auth = {'token':data.access_token, 'provider':'GOOGLE'};
              if($state.current.name == 'access.signin') {
    	        	$state.go('app.dashboard-v1');
    	      }
          }
          
        });
      
      
      /*check facebook sdk load complete*/
      $scope.$watch(function() {
    	        return UserService.FacebookIsReady();
    	      },
    	      function(newVal) {
    	        if (newVal)
    	          $scope.facebookReady = true;
    	      }
    	    );
      
      /*check googleplus sdk load complete*/
      $scope.$watch(function() {
	        return UserService.GooglePlusIsReady();
	      },
	      function(newVal) {
	        if (newVal)
	          $scope.googleplusReady = true;
	      }
	    );
	 
      
    $scope.Logout = Logout;

 	$scope.$on('Signin', function(event, data) {
        event.stopPropagation();

 		$scope.authuser = data.user;
 		$scope.projects = data.projects;
 		$localStorage.auth = {'token':data.user.token, 'provider':data.user.provider};
 		
 		if(data.projects.length == 0){
 			$state.go('access.project');
 		} else {
 			$state.go('app.dashboard-v1');
 		}
 	});

 	$scope.$on('Signup', function(event, data) {
        event.stopPropagation();

 		console.log(data);
 		$scope.authuser = data;
 		//$scope.projects = data.projects;
 		
 		$localStorage.auth = {'token':data.token, 'provider':data.provider};
    	$state.go('access.project');
 	});

 	$scope.$on('Logout', function(event) {
        event.stopPropagation();

        Logout();
 	});

    function Logout () {
        UserService.Logout($scope.authuser.provider);
        $scope.authuser = {};
        $scope.projects = {};
        delete $localStorage.auth;

        $state.go('access.signin');
    }

    // select project
    $scope.selectproject = function(index){
        if($scope.projects.length >= index){
            $scope.currentproject = $scope.projects[index]
        }
    }

    }])
  // bootstrap controller
  .controller('AccordionDemoCtrl', ['$scope', function($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'Accordion group header - #1',
        content: 'Dynamic group body - #1'
      },
      {
        title: 'Accordion group header - #2',
        content: 'Dynamic group body - #2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }])
  .controller('AlertDemoCtrl', ['$scope', function($scope) {
    $scope.alerts = [
      { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
      { type: 'info', msg: 'Heads up! This alert needs your attention, but it is not super important.' },
      { type: 'warning', msg: 'Warning! Best check yo self, you are not looking too good...' }
    ];

    $scope.addAlert = function() {
      $scope.alerts.push({type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }])
  .controller('ButtonsDemoCtrl', ['$scope', function($scope) {
    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };
  }])
  .controller('CarouselDemoCtrl', ['$scope', function($scope) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'img/c' + slides.length + '.jpg',
        text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][slides.length % 4]
      });
    };
    for (var i=0; i<4; i++) {
      $scope.addSlide();
    }
  }])
  .controller('DropdownDemoCtrl', ['$scope', function($scope) {
    $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      //console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
  }])
  .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  .controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }])
  .controller('PaginationDemoCtrl', ['$scope', '$log', function($scope, $log) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      $log.info('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
  }])
  .controller('PopoverDemoCtrl', ['$scope', function($scope) {
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverTitle = 'Title';
  }])
  .controller('ProgressDemoCtrl', ['$scope', function($scope) {
    $scope.max = 200;

    $scope.random = function() {
      var value = Math.floor((Math.random() * 100) + 1);
      var type;

      if (value < 25) {
        type = 'success';
      } else if (value < 50) {
        type = 'info';
      } else if (value < 75) {
        type = 'warning';
      } else {
        type = 'danger';
      }

      $scope.showWarning = (type === 'danger' || type === 'warning');

      $scope.dynamic = value;
      $scope.type = type;
    };
    $scope.random();

    $scope.randomStacked = function() {
      $scope.stacked = [];
      var types = ['success', 'info', 'warning', 'danger'];

      for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
          var index = Math.floor((Math.random() * 4));
          $scope.stacked.push({
            value: Math.floor((Math.random() * 30) + 1),
            type: types[index]
          });
      }
    };
    $scope.randomStacked();
  }])
  .controller('TabsDemoCtrl', ['$scope', function($scope) {
    $scope.tabs = [
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];
  }])
  .controller('RatingDemoCtrl', ['$scope', function($scope) {
    $scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };
  }])
  .controller('TooltipDemoCtrl', ['$scope', function($scope) {
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.dynamicTooltipText = 'dynamic';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
  }])
  .controller('TypeaheadDemoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.selected = undefined;



    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously

    $scope.getLocation = function(val) {
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(res){
        console.log(res);
        var addresses = [];
        angular.forEach(res.data.results, function(item){
          addresses.push(item.formatted_address);
        });
        return addresses;
      });
    };
  }])
  .controller('DatepickerDemoCtrl', ['$scope', function($scope) {
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

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

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  }])
  .controller('TimepickerDemoCtrl', ['$scope', function($scope) {
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.mytime = d;
    };

    $scope.changed = function () {
      //console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };
  }])

  // Form controller
  .controller('FormDemoCtrl', ['$scope', function($scope) {
    $scope.notBlackListed = function(value) {
      var blacklist = ['bad@domain.com','verybad@domain.com'];
      return blacklist.indexOf(value) === -1;
    };

    $scope.val = 15;
    var updateModel = function(val){
      $scope.$apply(function(){
        $scope.val = val;
      });
    };
    angular.element("#slider").on('slideStop', function(data){
      updateModel(data.value);
    });

    $scope.select2Number = [
      {text:'First',  value:'One'},
      {text:'Second', value:'Two'},
      {text:'Third',  value:'Three'}
    ];

    $scope.list_of_string = ['tag1', 'tag2'];
    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': ['tag1', 'tag2', 'tag3', 'tag4']  // Can be empty list.
    };

  }])

  // Flot Chart controller 
  .controller('FlotChartDemoCtrl', ['$scope', function($scope) {
    $scope.d = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];

    $scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];

    $scope.d0_2 = [ [0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3] ];

    $scope.d1_1 = [ [10, 120], [20, 70], [30, 70], [40, 60] ];

    $scope.d1_2 = [ [10, 50],  [20, 60], [30, 90],  [40, 35] ];

    $scope.d1_3 = [ [10, 80],  [20, 40], [30, 30],  [40, 20] ];

    $scope.d2 = [];

    for (var i = 0; i < 20; ++i) {
      $scope.d2.push([i, Math.sin(i)]);
    }   

    $scope.d3 = [ 
      { label: "iPhone5S", data: 40 }, 
      { label: "iPad Mini", data: 10 },
      { label: "iPad Mini Retina", data: 20 },
      { label: "iPhone4S", data: 12 },
      { label: "iPad Air", data: 18 }
    ];

    $scope.refreshData = function(){
      $scope.d0_1 = $scope.d0_2;
    };

    $scope.getRandomData = function() {
      var data = [],
      totalPoints = 150;
      if (data.length > 0)
        data = data.slice(1);
      while (data.length < totalPoints) {
        var prev = data.length > 0 ? data[data.length - 1] : 50,
          y = prev + Math.random() * 10 - 5;
        if (y < 0) {
          y = 0;
        } else if (y > 100) {
          y = 100;
        }
        data.push(y);
      }
      // Zip the generated y values with the x values
      var res = [];
      for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]])
      }
      return res;
    };

    $scope.d4 = $scope.getRandomData();
  }])

  // jVectorMap controller
  .controller('JVectorMapDemoCtrl', ['$scope', function($scope) {
    $scope.world_markers = [
      {latLng: [41.90, 12.45], name: 'Vatican City'},
      {latLng: [43.73, 7.41], name: 'Monaco'},
      {latLng: [-0.52, 166.93], name: 'Nauru'},
      {latLng: [-8.51, 179.21], name: 'Tuvalu'},
      {latLng: [43.93, 12.46], name: 'San Marino'},
      {latLng: [47.14, 9.52], name: 'Liechtenstein'},
      {latLng: [7.11, 171.06], name: 'Marshall Islands'},
      {latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis'},
      {latLng: [3.2, 73.22], name: 'Maldives'},
      {latLng: [35.88, 14.5], name: 'Malta'},
      {latLng: [12.05, -61.75], name: 'Grenada'},
      {latLng: [13.16, -61.23], name: 'Saint Vincent and the Grenadines'},
      {latLng: [13.16, -59.55], name: 'Barbados'},
      {latLng: [17.11, -61.85], name: 'Antigua and Barbuda'},
      {latLng: [-4.61, 55.45], name: 'Seychelles'},
      {latLng: [7.35, 134.46], name: 'Palau'},
      {latLng: [42.5, 1.51], name: 'Andorra'},
      {latLng: [14.01, -60.98], name: 'Saint Lucia'},
      {latLng: [6.91, 158.18], name: 'Federated States of Micronesia'},
      {latLng: [1.3, 103.8], name: 'Singapore'},
      {latLng: [1.46, 173.03], name: 'Kiribati'},
      {latLng: [-21.13, -175.2], name: 'Tonga'},
      {latLng: [15.3, -61.38], name: 'Dominica'},
      {latLng: [-20.2, 57.5], name: 'Mauritius'},
      {latLng: [26.02, 50.55], name: 'Bahrain'},
      {latLng: [0.33, 6.73], name: 'São Tomé and Príncipe'}
    ];

    $scope.usa_markers = [
      {latLng: [40.71, -74.00], name: 'New York'},
      {latLng: [34.05, -118.24], name: 'Los Angeles'},
      {latLng: [41.87, -87.62], name: 'Chicago'},
      {latLng: [29.76, -95.36], name: 'Houston'},
      {latLng: [39.95, -75.16], name: 'Philadelphia'},
      {latLng: [38.90, -77.03], name: 'Washington'},
      {latLng: [37.36, -122.03], name: 'Silicon Valley'}
    ];
  }])

  // signin controller
  .controller('SigninFormController', ['$scope', '$http', '$state', '$timeout', 'UserService',
                               function($scope,   $http,   $state,   $timeout,   UserService) {
	  $scope.authError = null;
	  
	  $scope.FacebookLogin = function(){
		  UserService.FacebookLogin();
	  };
	  $scope.GoogleLogin = UserService.GoogleLogin;

	  $scope.weblogin = function() {
		 var token = $('meta[name=csrf-token]').attr('content');
	     UserService.Login($scope.user.email, $scope.user.password, token).then(function(data){
	    	 $scope.authError = "";

	    	 $scope.$emit('Signin', data);
	    	 
	     },function(data) {
	    	 $scope.authError = data.error;
	     });
	  };
	  
	  $scope.weblogout = function() {
		$scope.$emit('Logout');
	  };
  }])

  // signup controller
  .controller('SignupFormController', ['$scope', '$http', '$state', 'UserService', '$localStorage',
                               function($scope,   $http,   $state,   UserService,   $localStorage) {
    $scope.authError = null;
    
    $scope.signup = function() {
    	var token = $('meta[name=csrf-token]').attr('content')
	    UserService.Signup($scope.user.name, $scope.user.email, $scope.user.password, token).then(function(data){
	    	 $scope.authError = "";
	    	 $scope.$emit('Signup', data);
	     },function(data) {
	    	 $scope.authError = data.error;
	     });
	};
  }])
   // project controller
  .controller('ProjectFormController', ['$rootScope', '$scope', '$window', '$http', '$state', 'UserService','$localStorage',
                               function($rootScope,   $scope,   $window,    $http,   $state,   UserService, $localStorage) {
    $scope.authError = null;
    
    $scope.createproject = function() {
    	var csrftoken = $('meta[name=csrf-token]').attr('content')
    	var authtoken = $scope.authuser.token;
    	
    	var projectname = $scope.project.name;
    	$scope.authError = "";
    	
    	$http({url:'project/add', 
	    	  method:'POST',
	    	  data:'csrf-token=' + csrftoken + '&authtoken=' + authtoken + '&projectname=' + projectname,
	    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
	    .then(function(response) {
	    	console.log("project add : " + JSON.stringify(response.data));
		    if (response.data.error) {
		        $scope.authError = response.data.error;
		        $window.alert(response.data.error);
		    }else{
		    	// project data save
		    	$rootScope.projects = response.data.projects
		    	$state.go('app.dashboard-v1');
		    }
	    }, function(x) {
	    	$scope.authError = 'Server Error';
	    });
	}
  }])
  
  // tab controller
  .controller('CustomTabController', ['$scope', function($scope) {
    $scope.tabs = [true, false, false];
    $scope.tab = function(index){
      angular.forEach($scope.tabs, function(i, v) {
        $scope.tabs[v] = false;
      });
      $scope.tabs[index] = true;
    }
  }])
 ;