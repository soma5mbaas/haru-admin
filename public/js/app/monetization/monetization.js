
app.controller('NonetizationCtrl', ['$scope', '$http', 'limitToFilter',  function($scope, $http, limitToFilter) {
 /*
  $scope.chart = {
    //This is not a highcharts object. It just looks a little like one!
    options: {
      //This is the Main Highcharts chart config. Any Highchart options are valid here.
      //will be ovverriden by values specified below.
      chart: {
        type: 'bar'
      },
      tooltip: {
        style: {
          padding: 10,
          fontWeight: 'bold'
        }
      }
    },

    //The below properties are watched separately for changes.

    //Series object (optional) - a list of series using normal highcharts series options.
    series: [{
      data: [10, 15, 12, 8, 7]
    }],
    //Title configuration (optional)
    title: {
      text: 'Hello'
    },
    //Boolean to control showng loading status on chart (optional)
    loading: false,
    //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
    //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
    xAxis: {
      currentMin: 0,
      currentMax: 20,
      title: {text: 'values'}
    },
    //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
    useHighStocks: false,
    //size (optional) if left out the chart will default to size of the div or something sensible.
    size: {
      width: 400,
      height: 300
    },
    //function (optional)
    func: function (chart) {
      //setup some logic for the chart
    }

  };

*/

  $scope.chart = {
    options: {
      chart: {
        type: 'bar'
      }
    },
    series: [{
      data: [10, 15, 12, 8, 7]
    }],
    title: {
      text: 'Hello'
    }
  };

  $scope.chartConfig = {
    options: {
      chart: {
        type: 'bar'
      }
    },
    series: [{
      data: [10, 15, 12, 8, 7]
    }],
    title: {
      text: 'Hello'
    }
  };

  $scope.ideas = [
    ['ideas1', 1],
    ['ideas2', 8],
    ['ideas3', 5]
  ];

  $scope.limitedIdeas = limitToFilter($scope.ideas, 2);

}]);