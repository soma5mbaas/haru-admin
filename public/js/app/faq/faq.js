app.controller('FAQCtrl', ['$scope', 'faqs', function($scope, faqs) {

  $scope.labels = [
    {name: 'Angular', filter:'angular', color:'#23b7e5'},
    {name: 'Bootstrap', filter:'bootstrap', color:'#7266ba'},
    {name: 'Client', filter:'client', color:'#fad733'},
    {name: 'Work', filter:'work', color:'#27c24c'}
  ];

  var colorlist = ['#7266ba', '#fad733', '#27c24c', '#23b7e5'];

  $scope.faqcategory = [];
  faqs.getFaqCategory($scope.user.currentproject.applicationkey).then(function(result){
    console.log(result);

    $scope.faqcategory.push(
        {
          Id:'',
          Category: 'All',
          filter : '',
          color: '#23b7e5'
        }
    );
    result.forEach(function(value, index){
      var item = value;
      item.filter = value.Category;
      item.color =colorlist[index % 4];
      $scope.faqcategory.push(item);
    });
  });


  $scope.addCategory = function(){
    var category = $scope.newLabel.name;


    $scope.faqcategory.push(
      {
        Id:'',
        Category: category,
        Filter : category,
        color: '#23b7e5'
      }
    );

   faqs.addFaqCategory($scope.user.currentproject.applicationkey, category).then(function(result){
      console.log(result);
    });
    $scope.newLabel.name = '';
  }


  $scope.labelClass = function(label) {
    return {
      'b-l-info': angular.lowercase(label) === 'angular',
      'b-l-primary': angular.lowercase(label) === 'bootstrap',
      'b-l-warning': angular.lowercase(label) === 'client',
      'b-l-success': angular.lowercase(label) === 'work'      
    };
  };

  $scope.AddFAQ =function(){

  };


  $scope.isCollapsed = true;
  $scope.sortableOptions = {
    sortupdate: function( event, ui , elm) {
      //ui.item contains the current dragged element.
      //Triggered when the user stopped sorting and the DOM position has changed.

      console.log('sortupdate', ui.item.parent(), elm);
      elm.children('li').each(function () {
        console.log(this.id); // "this" is the current element in the loop
      });
    }
  };
}]);


app.controller('FAQListCtrl', ['$scope', 'faqs', '$stateParams', function($scope, faqs, $stateParams) {
  var fold = $stateParams.fold
  console.log(fold);
  if($stateParams.fold == ''){
    $scope.fold = 'All'
  } else {
    $scope.fold = $stateParams.fold;
  }

  $scope.faqlists = [];
  faqs.getFaqList($scope.user.currentproject.applicationkey, $scope.fold).then(function(result){
    if(result == 'null'){
      $scope.faqlists = [];
    } else {
      $scope.faqlists = result;
    }
    console.log($scope.faqlists);
  });


  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
}]);
/*

app.controller('FAQListCtrl', ['$scope', 'faqs', '$stateParams', function($scope, mails, $stateParams) {
  $scope.fold = $stateParams.fold;
  faqs.all().then(function(mails){
    $scope.mails = mails;
  });
}]);
*/
angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});