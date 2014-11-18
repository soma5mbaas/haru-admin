// config

var app =  
angular.module('app')
  .constant('server_url', 'http://api.haru.io')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', 'FacebookProvider', 'GooglePlusProvider','cryptProvider','$socketProvider',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide,  FacebookProvider,   GooglePlusProvider, cryptProvider, $socketProvider) {
        cryptProvider.setSecret('abcdefg1234567890');
        FacebookProvider.init('858617410822846');
        GooglePlusProvider.init({
            clientId: '619633840927-vu2p1v16sd2fi015u6c0apnifg5cosm0.apps.googleusercontent.com',
            apiKey: 'derp'
        });

        $socketProvider.configure({
            address: "/sockJsChat"
        });

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }]);

app.filter('bytes', function() {
    return function(bytes, precision) {

        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        if(number == -Infinity){
            number = 0;
        }
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});

app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});