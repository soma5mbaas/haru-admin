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
    service('UserService', ['$rootScope', '$http', 'Facebook', 'GooglePlus', 
                    function($rootScope,   $http,    Facebook,   GooglePlus) {
    	
    	var isloggedin = false;
    	var provider = '';
    	var authError = null;
    	var userinfo = {};
    	var scope = '';
    	
    	this.isloggedin = function(){
    		return isloggedin;
    	}
    	
    	this.setScope = function(scope){
    		this.scope = scope;
    	};
    	
	    this.getUserInfo = function(){
	    	return userinfo;
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
		
	    
	    this.Login = function(email, password) {
	      // Try to login
	      $http.post('api/login', {email: email, password: password})
	      .then(function(response) {
	        if ( !response.data.user ) {
	          
	          this.authError = 'Email or Password not right';
	        }else{
	          this.userinfo.name = response.data.user;
	          this.userinfo.email = response.data.user;
	          this.provider = 'web'; 
	          $state.go('app.dashboard-v1');
	        }
	      }, function(x) {
	        this.authError = 'Server Error';
	      });
		};
		    
	    this.Logout = function(){
	    	console.log('logout' + this.isloggedin + this.provider);
	    	if(!this.isloggedin) return;
	    	
	    	if(this.provider =='facebook'){
	    		this.FacebookLogout();
	    	} else if (this.provider == 'google'){
	    		this.GoogleLogout();
	    	} else {
		    	clearUserinfo();
	    	}
	    };
		    
		
	   
	    
	    this.FacebookLogout = function() {
	        Facebook.logout(function() {
	        	clearUserinfo();
	        });
	    };
	    
	    this.FacebookMe = function() {
	        Facebook.api('/me', function(response) {
	        	userinfo = response;
	        	console.log('facebook : ' + userinfo);
	        });
	    };
	    this.FacebookLogin = function() {
	        Facebook.login(function(response) {
	         if (response.status == 'connected') {
	        	// console.log(this.isloggedin + response);
	        	 isloggedin = true;
	        	 provider = 'facebook';
	        	 Facebook.api('/me', function(response) {
	 	        	userinfo = response;
	 	        	console.log('facebook : ' + userinfo);
	 	        });
	         }
	       });
	    };
	   
	      

	     this.GoogleLogout = function () {
		     GooglePlus.logout();
		     clearUserinfo();
	     };
	     
	     this.GoogleMe = function(){
	    	 GooglePlus.getUser().then(function (user) {
	            	userinfo = user;
	            	console.log('google : ' + JSON.stringify(userinfo));
	         });
		 };
		 this.GoogleLogin = function () {
		        GooglePlus.login().then(function (authResult) {
		            console.log(authResult);
		        	isloggedin = true;
		        	provider = 'google';
		           /*
		        	GooglePlus.getUser().then(function (user) {
		            	userinfo = user;
		            	console.log('google : ' + JSON.stringify(userinfo));
		            });*/
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