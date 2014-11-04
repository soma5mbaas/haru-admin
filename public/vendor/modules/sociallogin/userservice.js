(function(window, angular) {
  'use strict';

  // Deferred Object which will be resolved when the Facebook SDK is ready
  // and the `fbAsyncInit` function is called.

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
    service('UserService', ['$rootScope', '$http', '$state', 'Facebook', 'GooglePlus', '$localStorage','$sessionStorage', '$q',
                    function($rootScope,   $http,   $state,   Facebook,   GooglePlus, $localStorage, $sessionStorage, $q) {
    	
		 this.UserInfo = function(csrftoken, authtoken) {
		      var deferred = $q.defer();

		      $http({url:'user/getfortoken', 
		    	  method:'POST',
		    	  data:'csrf-token=' + csrftoken + '&token=' + authtoken +'&provider=WEB',
		    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
		      .then(function(response) {
		        if (response.data.user) {
		          deferred.resolve(response.data);
		        }else{
		          deferred.reject(response.data)
		        }
		      }, function(x) {
		        deferred.reject({ error: "Server Error" });
		      });
		      return deferred.promise;
			};
			
	    this.Login = function(email, password, token) {
	      var deferred = $q.defer();

	      $http({url:'user/login', 
	    	  method:'POST',
	    	  data:'csrf-token='+token+'&email=' +email+ '&password='+password+'&provider=WEB',
	    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
	      .then(function(response) {
	        if (response.data.user) {
	          var data = response.data;
	          deferred.resolve(data);
	        }else{
	          deferred.reject(response.data);
	        }
	      }, function(x) {
	        deferred.reject({ error: "Server Error" });
	      });
	      
	      return deferred.promise;
		};
		
		    
		this.Signup = function(name, email, password, token){
                            var deferred = $q.defer();
                            $http({url:'user/add',
                                method:'POST',
                                data:'csrf-token='+token+'&email=' +email+ '&password='+password+'&name='+name+'&provider=WEB',
                                headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
                                .then(function(response) {
                                    console.log(response);
                                    if ( response.data.email ) {
                                        deferred.resolve(response.data);
                                    }else{
                                        deferred.reject(response.data);
                                    }
                                }, function(x) {
                                    deferred.reject({ error: "Server Error" });
                                });
                            return deferred.promise;
                        };
		
	    this.Logout = function(provider){
	    	try{
		    	if (provider =='FACEBOOK') {
		    		Facebook.logout();
		    	} else if (provider == 'GOOGLE') {
		    		GooglePlus.logout();
		    	}
	    	}catch(exception){
	    	}
	    };
		
		this.FacebookIsReady = function(){
			return Facebook.isReady()
		};
	
	    this.FacebookMe = function(csrftoken, authtoken) {
	    	var deferred = $q.defer();
	    	
	          Facebook.api('/me', function(response) {
	        	 $http({url:'snsuser/add', 
			    	  method:'POST',
			    	  data:'csrf-token='+csrftoken+'&email=' +response.email+ '&password=&name='+response.name+'&provider=FACEBOOK&timezone='+response.timezone+'&locale='+response.locale+'&gender='+response.gender+'&token='+authtoken,
			    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
		        .then(function(response) {
		          if ( response.data ) {
		        	deferred.resolve(response.data);
		          } else {
		        	deferred.reject(response);
		          }
		        }, function(x) {
		    	  deferred.reject({error:'Server Error'});
		        });
	          });
	        return deferred.promise;
	    };
	    
	    this.FacebookLogin = function() {
	       Facebook.login(function(response) {
	    	   
	       });
	    };
	   
	      
	    this.GooglePlusIsReady = function(){
			return GooglePlus.isReady()
		};
	   
	     this.GoogleMe = function(csrftoken, authtoken){
	    	 var deferred = $q.defer();
	    	 
	    	 GooglePlus.getUser().then(function (user) {
	    		 console.log(JSON.stringify(user));
            	$sessionStorage.user = user;

	        	 $http({url:'snsuser/add', 
			    	  method:'POST',
			    	  data:'csrf-token='+csrftoken+'&email=' +user.email+ '&password=&name='+user.name+'&provider=GOOGLE&timezone='+user.timezone+'&locale='+user.locale+'&gender='+user.gender+'&token='+authtoken,
			    	  headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
		       .then(function(response) {
		    	  if ( response.data ) {
		    		deferred.resolve(response.data);
		          } else {
					console.log(response);
		        	deferred.reject(response);
		          }
		       }, function(x) {
		    	  deferred.reject({error:'Server Error'});
			   });
	         });
	    	 
	    	 return deferred.promise;
		 };
		 
		 this.GoogleLogin = function () {
		        GooglePlus.login().then(function (authResult) {

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