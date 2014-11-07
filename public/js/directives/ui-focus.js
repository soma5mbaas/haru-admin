angular.module('app')
  .directive('uiFocus', function($timeout, $parse) {
    return {
      link: function(scope, element, attr) {
        var model = $parse(attr.uiFocus);
        scope.$watch(model, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function() {
           scope.$apply(model.assign(scope, false));
        });
      }
    };
  });

angular.module('app')
    .directive('selectfocus', function($timeout, $parse) {
      return {
        link: function(scope, element, attr) {
          var model = $parse(attr.selectfocus);
          scope.$watch(model, function(value) {
            if(value === true) {
              $timeout(function() {
                if (document.createEvent) {
                  var e = document.createEvent("MouseEvents");
                  e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                  element[0].dispatchEvent(e);
                } else if (element.fireEvent) {
                  element[0].fireEvent("onmousedown");
                }
              });
            }
          });
        }
      };
    });