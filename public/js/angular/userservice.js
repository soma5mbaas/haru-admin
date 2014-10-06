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
    	var token = '';
    	
    	this.isLogin = function(){
    		return isloggedin;
    	}
    	this.setLogin = function(login){
    		isloggedin = !!login;
    	}
    	this.setProvider = function(p){
    		provider = p;
    	}
    	
    	this.setScope = function(scope){
    		scope = scope;
    	};
    	
    	this.getToken = function(){
	    	return token;
	    };
	    this.setToken = function(token){
	    	token = token;
	    };
	    
    	
	    this.getUserInfo = function(){
	    	return userinfo;
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
	          isloggedin = false;
	          $rootScope.$broadcast('Auth:statusChange', response.data);
	        }else{
		      userinfo = response.data;
		      userinfo.status = 'connected';
		      isloggedin = true;
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
		          isloggedin = false;
		          $rootScope.$broadcast('Auth:statusChange', response.data);
		        }else{
			      userinfo = response.data;
			      userinfo.status = 'signup';
			      isloggedin = true;
			      $sessionStorage.user = userinfo.data;
			      $rootScope.$broadcast('Auth:statusChange', userinfo);
		        }
		      }, function(x) {
		        authError = 'Server Error';
		      });
		};
		
	    this.Logout = function(){
	    	console.log('logout' + isloggedin + provider);
	    	clearUserinfo();
	    	
	    	if (provider =='FACEBOOK') {
	    		this.FacebookLogout();
	    	} else if (provider == 'GOOGLE') {
	    		this.GoogleLogout();
	    	}
	    	
	    	$rootScope.$broadcast('Auth:statusChange', {'status':'disconnect'});
	    };
		    
		
		this.FacebookIsReady = function(){
			return Facebook.isReady()
		}
	    
	    this.FacebookLogout = function() {
	        Facebook.logout(function() {
	        	
	        });
	    };
	    
      
	    this.FacebookMe = function(csrftoken, authtoken) {
	        Facebook.api('/me', function(response) {
	        	userinfo = response;
		        $sessionStorage.user =response;
		        
	        	console.log('facebook : ' +  JSON.stringify(userinfo));
	        	
	        	 $http({url:'snsuser/add', 
			    	  method:'POST',
			    	  data:'csrf-token='+csrftoken+'&email=' +userinfo.email+ '&password=&name='+userinfo.name+'&provider=FACEBOOK&timezone='+userinfo.timezone+'&locale='+userinfo.locale+'&gender='+userinfo.gender+'&token='+authtoken,
			    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
		      .then(function(response) {
		    	console.log("facebook : " + JSON.stringify(response.data));
		    	  
		        if ( !response.data ) {
		          authError = response.data.error;
		          response.data.status = 'error';
		          isloggedin = false;
		          $rootScope.$broadcast('Auth:statusChange', response.data);
		        }else{
		        	$sessionStorage.userproject = response.data.projects
		        	$rootScope.$broadcast('Project:statusChange', response.data);
		        }
		      }, function(x) {
		        authError = 'Server Error';
		      });
	        });
	    };
	    
	    this.FacebookLogin = function() {
	        Facebook.login(function(response) {
	         if (response.status == 'connected') {
	        	// broadcast Facebook:statusChange
	        	 isloggedin = true;
	        	 provider = 'FACEBOOK';
	         } else {
	        	 isloggedin = false;
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
	     
	     this.GoogleMe = function(csrftoken, authtoken){
	    	 GooglePlus.getUser().then(function (user) {
            	userinfo = user;
            	$sessionStorage.user = user;

	        	 $http({url:'snsuser/add', 
			    	  method:'POST',
			    	  data:'csrf-token='+csrftoken+'&email=' +user.email+ '&password=&name='+user.name+'&provider=GOOGLE&timezone='+user.timezone+'&locale='+user.locale+'&gender='+user.gender+'&token='+authtoken,
			    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
		       .then(function(response) {
		    	 console.log("google : " + JSON.stringify(response.data));
		    	  
		        if ( !response.data ) {
		          authError = response.data.error;
		          response.data.status = 'error';
		          isloggedin = false;
		          $rootScope.$broadcast('Auth:statusChange', response.data);
		        }else{
		        	$sessionStorage.userproject = response.data.projects
		        	$rootScope.$broadcast('Project:statusChange', response.data);
		        }
		       }, function(x) {
			        authError = 'Server Error';
			   });
	         });
		 };
		 
		 this.GoogleLogin = function () {
		        GooglePlus.login().then(function (authResult) {
		            //console.log("userservice google : " + authResult);
		            isloggedin = true;
		        	provider = 'GOOGLE';
		        }, function (err) {
		            console.log(err);
		            isloggedin = false;
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