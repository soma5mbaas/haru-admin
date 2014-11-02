(function(window, angular,undefined) {
  'use strict';
  /**
  * Options object available for module
  * options/services definition.
  * @type {Object}
  */
  
  
  var settings = {};
  var flags = {
		    sdk: false,
		    ready: false
		  };
  /**
  * googleplus module
  */
  angular.module('googleplus', []).
  	value('settings', settings).
	value('flags', flags).
    /**
    * GooglePlus provider
    */
    provider('GooglePlus', [function() {

      /**
      * clientId
      * @type {Number}
      */
    	settings.clientId = null;

      this.setClientId = function(clientId) {
    	  settings.clientId = clientId;
        return this;
      };

      this.getClientId = function() {
        return settings.clientId;
      };


      settings.loadSDK = true;

      this.setLoadSDK = function(a) {
        settings.loadSDK = !!a;
      };

      this.getLoadSDK = function() {
        return settings.loadSDK;
      };
      
      /**
      * apiKey
      * @type {String}
      */
      settings.apiKey = null;

      this.setApiKey = function(apiKey) {
    	  settings.apiKey = apiKey;
        return this;
      };

      this.getApiKey = function() {
        return settings.apiKey;
      };
      
      

      /**
      * Scopes
      * @default 'https://www.googleapis.com/auth/plus.login'
      * @type {Boolean}
      */
      settings.scopes = 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email';

      this.setScopes = function(scopes) {
    	  settings.scopes = scopes;




        return this;
      };

      this.getScopes = function() {
        return settings.scopes;
      };

      
      /**
      * Init Google Plus API
      */
      this.init = function(customOptions, _loadSDK) {
        angular.extend(settings, customOptions);
        
        if (angular.isDefined(_loadSDK)) {
            settings.loadSDK = !!_loadSDK;
        }
      };

      /**
      * This defines the Google Plus Service on run.
      */
      this.$get = ['$q', '$rootScope', '$window','$timeout', function($q, $rootScope, $window, $timeout) {

      
        /**
        * Create a deferred instance to implement asynchronous calls
        * @type {Object}
        */
        var deferred  = $q.defer();

        /**
        * NgGooglePlus Class
        * @type {Class}
        */
        var NgGooglePlus = function () {};

        

 	   /**
        * Ready state method
        * @return {Boolean}
        */
        NgGooglePlus.prototype.isReady = function() {
          return flags.ready;
        };
        
        NgGooglePlus.prototype.login =  function () {
          gapi.auth.authorize({
            client_id: settings.clientId,
            scope: settings.scopes,
            immediate: false
          }, this.handleAuthResult);
          return deferred.promise;
        };

        NgGooglePlus.prototype.checkAuth = function() {
          gapi.auth.authorize({
            client_id: settings.clientId, 
            scope: settings.scopes,
            immediate: true
          }, this.handleAuthResult);
          return deferred.promise;
        };

        NgGooglePlus.prototype.handleClientLoad = function () {
          gapi.client.setApiKey(settings.apiKey);
          gapi.auth.init(function () { });
          $timeout(this.checkAuth, 1);
        };
        
        NgGooglePlus.prototype.handleAuthResult = function(authResult) {
            if (authResult && !authResult.error) {
              authResult.status="loggin";
           	  $rootScope.$broadcast('GooglePlus:statusChange', authResult);
              deferred.resolve(authResult);
              $rootScope.$apply();
            } else {
              deferred.reject('error');
            }
        };

        NgGooglePlus.prototype.getUser = function() {
            var deferred = $q.defer();

            gapi.client.load('oauth2', 'v2', function () {
              gapi.client.oauth2.userinfo.get().execute(function (resp) {
                deferred.resolve(resp);
                $rootScope.$apply();
              });
            });

            return deferred.promise;
        };
        
        NgGooglePlus.prototype.logout = function(){
        	 var token = gapi.auth.getToken();
        	 var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token='+token.access_token;
        	 console.log(revokeUrl);
    	      // 비동기 GET 요청을 수행합니다.
    	      $.ajax({
    	        type: 'GET',
    	        url: revokeUrl,
    	        async: false,
    	        contentType: "application/json",
    	        dataType: 'jsonp',
    	        success: function(nullResponse) {
    	          // 사용자가 연결 해제되었으므로 작업을 수행합니다.
    	          // 응답은 항상 정의되지 않음입니다.
    	        	var disconnect = {};
    	        	disconnect.status = 'disconnect';
    	        	console.log('logout success');
    	          $rootScope.$broadcast('GooglePlus:statusChange', disconnect);
    	        },
    	        error: function(e) {
    	          // 오류 처리
    	          // console.log(e);
    	          // 실패한 경우 사용자가 수동으로 연결 해제하게 할 수 있습니다.
    	          // https://plus.google.com/apps
      	          console.log('logout fail');
    	        }
    	      });
    	   
        };
        
        NgGooglePlus.prototype.getToken = function() {
          return gapi.auth.getToken();
        };

        NgGooglePlus.prototype.setToken = function(token) {
          return gapi.auth.setToken(token);
        };

        return new NgGooglePlus();
      }];
  }])

  // Initialization of module
  .run(['$rootScope', '$timeout' , function($rootScope, $timeout) {
	    var libonload = function() {
	    	flags.sdk = true;
	    	
	    	$timeout(function(){
		    	flags.ready = true;

	    		gapi.auth.authorize({
	                client_id: settings.clientId, 
	                scope: settings.scopes,
	                immediate: true
	              }, function(authResult){
	            	  //console.log(authResult);
	            	  if (authResult && !authResult.error) {
	                	  authResult.status='connected';
	                	  $rootScope.$broadcast('GooglePlus:statusChange', authResult);
	            	  }
	            	  
	            	  //$rootScope.$broadcast('GooglePlus:statusChange', authResult);
	              });
	    	}, 1000);
	    };
		  
	    var loadSDK = settings.loadSDK;
	    delete(settings['loadSDK']); // Remove loadSDK from settings since this isn't part from Facebook API.
	
	    if(loadSDK) {
	        (function injectScript(){
			    var po = document.createElement('script');
			    po.type = 'text/javascript';
			    po.async = true;
			    po.src = 'https://apis.google.com/js/client:plusone.js';
			    po.onload = libonload
			    po.onreadystatechange = function() {
			    	if (this.readyState == 'complete') {
			    		libonload();
			    	}
			    }
			    
			    var s = document.getElementsByTagName('script')[0];
			    s.parentNode.insertBefore(po, s);
			  })();
	  	}; // end loadSDK
  	}])
})(window, angular);