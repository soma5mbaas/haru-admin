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
    service('UserService', ['$rootScope', '$http', '$state', 'Facebook', 'GooglePlus', '$localStorage',
                    function($rootScope,   $http,   $state,   Facebook,   GooglePlus, $localStorage) {
    	
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
	    	return userinfo;
	    };
	    this.setUserInfo = function(user){
	    	userinfo = user;
	    };
	    
	    
	    this.getUserName = function(){
	    	if(!this.isloggedin || !this.userinfo.name) return '';
	    	
	    	return this.userinfo.name;
	    };
	    
	    this.getUserEmail = function(){
	    	if(!this.isloggedin || !this.userinfo.email) return '';
	    	
	    	return this.userinfo.email;
	    };
	    
	    var clearUserinfo = function(){
			userinfo = {};
	    	provider = '';
	    	isloggedin = false;
		};
		
	    
	    this.Login = function(email, password, token) {
	      // Try to login
	      $http({url:'user/login', 
	    	  method:'POST',
	    	  data:'csrf-token='+token+'&email=' +email+ '&password='+password,
	    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
	      .then(function(response) {
	    	console.log(response);
	        if ( !response.data.email ) {
	          authError = 'Email or Password not right';
	        }else{
	          provider = 'web'; 
	          isloggedin = true;
		      userinfo = response.data;
		      console.log(response.data);
		      $localStorage.user = response.data;
		      $rootScope.$broadcast('Auth:statusChange', {'status':'connected'});
		    	
	         
	        }
	      }, function(x) {
	        authError = 'Server Error';
	      });
		};
		
		    
		this.Signup = function(name, email, password, token){
			//$http.post('user/add', {name: name, email:email, password:password})
			   $http({url:'user/login', 
			    	  method:'POST',
			    	  data:'csrf-token='+token+'&email=' +email+ '&password='+password+'&name='+name,
			    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
		      .then(function(response) {
		        if ( !response.data.email ) {
		          authError = response;
		        }else{
		          provider = 'web'; 
			      isloggedin = true;
			      userinfo = response.data;
			      $localStorage.user = response.data;
			      console.log("web :" + JSON.stringify(userinfo));
			      $rootScope.$broadcast('Auth:statusChange', {'status':'connected'});
		        }
		      }, function(x) {
		        authError = 'Server Error';
		      });
		};
		
	    this.Logout = function(){
	    	console.log('logout' + isloggedin + provider);
	    	

	    	$localStorage.$reset();
	    	$rootScope.$broadcast('Auth:statusChange', {'status':'disconnect'});
	    	
	    	if(provider =='facebook'){
	    		this.FacebookLogout();
	    	} else if (provider == 'google'){
	    		this.GoogleLogout();
	    	} else {
		    	clearUserinfo();
	    	}
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
	        	$localStorage.user = response;
	        	console.log('facebook : ' +  JSON.stringify(userinfo));
	        });
	    };
	    this.FacebookLogin = function() {
	        Facebook.login(function(response) {
	         if (response.status == 'connected') {
	        	
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
	            	$localStorage.user = user;
	            	console.log('google : ' + JSON.stringify(userinfo));
	         });
		 };
		 this.GoogleLogin = function () {
		        GooglePlus.login().then(function (authResult) {
		            console.log(authResult);
		        	
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