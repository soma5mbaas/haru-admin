(function(window, angular, undefined) {
  'use strict';

  // Deferred Object which will be resolved when the Facebook SDK is ready
  // and the `fbAsyncInit` function is called.
  var loadDeferred;

  /**
   * @name User
   * @kind function
   * @description
   * An Angularjs module to take approach of User javascript sdk.
   *
   * @author parkjungun <pheadra4@gmail.com>
   */
  angular.module('user', ['facebook',
                          'googleplus']).
    /**
     * UserService Servie
     */
    service('UserService', ['$rootScope', '$http', '$state', 'Facebook', 'GooglePlus', '$localStorage','$sessionStorage',
                    function($rootScope,   $http,   $state,   Facebook,   GooglePlus, $localStorage, $sessionStorage) {
    	
    	var isloggedin = false;
    	var provider = '';
    	var authError = null;
    	var userinfo = {};
    	var scope = '';
    	
    	this.isloggedin = function(){
    		return isloggedin;
    	}
    	this.setLoggedin = function(login){
    		isloggedin = !!login;
    	}
    	this.setProvider = function(p){
    		provider = p;
    	}
    	
    	this.setScope = function(scope){
    		this.scope = scope;
    	};
    	
	    this.getUserInfo = function(){
	    	return $sessionStorage.user;
	    };
	    this.setUserInfo = function(user){
	    	userinfo = user;
	    };
	    
	    var clearUserinfo = function(){
	    	isloggedin = false;
	    	$localStorage.$reset();
	    	$sessionStorage.$reset();
		};
		
	    
	    this.Login = function(email, password, token) {
	      // Try to login
	      $http({url:'user/login', 
	    	  method:'POST',
	    	  data:'csrf-token='+token+'&email=' +email+ '&password='+password+'&provider=WEB',
	    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
	      .then(function(response) {
	    	console.log("Login : " + response.data);
		    	
	        if ( !response.data.email ) {
	          authError = response.data.error;
	          response.data.status = 'error';
	          $rootScope.$broadcast('Auth:statusChange', response.data);
	        }else{
		      userinfo = response.data;
		      userinfo.status = 'connected';
		      
		      $sessionStorage.user = userinfo.data;
		      $rootScope.$broadcast('Auth:statusChange', userinfo);
	        }
	      }, function(x) {
	        authError = 'Server Error';
	      });
		};
		
		    
		this.Signup = function(name, email, password, token){
			//$http.post('user/add', {name: name, email:email, password:password})
			   $http({url:'user/add', 
			    	  method:'POST',
			    	  data:'csrf-token='+token+'&email=' +email+ '&password='+password+'&name='+name+'&provider=WEB',
			    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
		      .then(function(response) {
		    	console.log("signup : " + response.data);
		    	  
		        if ( !response.data.email ) {
		          authError = response.data.error;
		          response.data.status = 'error';
		          $rootScope.$broadcast('Auth:statusChange', response.data);
		        }else{
			      userinfo = response.data;
			      userinfo.status = 'signup';
			      
			      $sessionStorage.user = userinfo.data;
			      $rootScope.$broadcast('Auth:statusChange', userinfo);
		        }
		      }, function(x) {
		        authError = 'Server Error';
		      });
		};
		
	    this.Logout = function(){
	    	console.log('logout' + isloggedin + provider);
	    	
	    	if(provider =='facebook'){
	    		this.FacebookLogout();
	    	} else if (provider == 'google'){
	    		this.GoogleLogout();
	    	} else {
		    	clearUserinfo();
	    	}
	    	$rootScope.$broadcast('Auth:statusChange', {'status':'disconnect'});

	    };
		    
		
		this.FacebookIsReady = function(){
			return Facebook.isReady()
		}
	    
	    this.FacebookLogout = function() {
	        Facebook.logout(function() {
	        	clearUserinfo();
	        });
	    };
	    
      
	    this.FacebookMe = function() {
	        Facebook.api('/me', function(response) {
	        	userinfo = response;
	        	$sessionStorage.user = response;
	        	console.log('facebook : ' +  JSON.stringify(userinfo));
	        });
	    };
	    
	    this.FacebookLogin = function() {
	        Facebook.login(function(response) {
	         if (response.status == 'connected') {
	        	// broadcast Facebook:statusChange
	         }
	       });
	    };
	   
	      
	    this.GooglePlusIsReady = function(){
			return GooglePlus.isReady()
		}
	     this.GoogleLogout = function () {
		     GooglePlus.logout();
		     clearUserinfo();
	     };
	     
	     this.GoogleMe = function(){
	    	 GooglePlus.getUser().then(function (user) {
	            	userinfo = user;
	            	$sessionStorage.user = user;
	            	console.log('google : ' + JSON.stringify(userinfo));
	         });
		 };
		 this.GoogleLogin = function () {
		        GooglePlus.login().then(function (authResult) {
		            console.log("userservice : " + authResult);
		        }, function (err) {
		            console.log(err);
		        });
		      };
        
    }]).

    /**
     * Module initialization
     */
    run([
      '$rootScope',
      '$q',
      '$window',
      '$timeout',
      function($rootScope,  $q, $window, $timeout) {
    	 
      }
    ]);

})(window, angular);