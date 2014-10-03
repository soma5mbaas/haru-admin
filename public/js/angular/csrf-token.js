(function() {
  'use strict';

  angular.module('stefansundin.add-csrf-token', []).directive('addCsrfToken', function() {
	  return {
	    compile: function(el, attrs) {
	      var token;
	      if (!el.is('form')) {
	        return new Error('Not a form');
	      }
	      token = $('meta[name=csrf-token]').attr('content');
	      return el.prepend("<input type='hidden' name='authenticity_token' value='" + token + "'>");
	    }
	  };
	});

})();