app.controller('FAQCtrl', ['$scope', 'faqs', '$state', '$window', 'toaster', function($scope, faqs, $state, $window, toaster) {
  if(isEmpty($scope.user.currentproject)){
    //$window.alert('project를 선택해 주십시오!!!');
    toaster.pop('note', 'Select Project', '프로젝트를 선택해주세요.');

    console.log($scope.user.currentproject, $state.current.name);
    $state.go('app.projects');
  }
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }



  var colorlist = ['#7266ba', '#fad733', '#27c24c'];
  var colorindex = 0;

  $scope.faqcategory = [];
  faqs.getFaqCategory($scope.user.currentproject.applicationkey).then(function(faqresult){
    var result = faqresult.return;

    $scope.faqcategory.push({
          Id:'',
          category: 'All',
          filter : '',
          color: '#7266ba'
        });

    result.forEach(function(value, index){
      colorindex = colorindex+1
      var item = value;
      item.filter = value.category;
      item.color = colorlist[colorindex % 3];
      $scope.faqcategory.push(item);
    });
  });


  $scope.addCategory = function(){
    var category = $scope.newLabel.name;

    var existcategory = false;
    $scope.faqcategory.forEach(function(elem){
      if(elem.category == category){
        $window.alert('똑같은 이름의 카테고리가 있습니다.');
        existcategory = true;
      }
    });

    // 존재하지 않으면 추가
    if(existcategory == false){
      colorindex = colorindex +1;
      $scope.faqcategory.push({
            Id:'',
            category: category,
            filter : category,
            color: colorlist[colorindex % 3]
          });

      faqs.addFaqCategory($scope.user.currentproject.applicationkey, category).then(function(result){
        console.log(result);
      });

    }
    $scope.newLabel.name = '';
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
  $scope.reflash = 0;
  if($stateParams.fold == ''){
    $scope.fold = 'All'
  } else {
    $scope.fold = $stateParams.fold;
  }
  console.log( $scope.fold);

  $scope.faqlists = [];
  getfaqlist = function() {
    faqs.getFaqList($scope.user.currentproject.applicationkey, $scope.fold).then(function (result) {
      if (result.return === null) {
        $scope.faqlists = [];
      } else {
        $scope.faqlists = result.return;
      }
      $scope.reflash = $scope.reflash + 1;
    });
  };
  getfaqlist();


  $scope.remove = function(index){
    console.log($scope.faqlists [index]);

    faqs.deleteFaq($scope.user.currentproject.applicationkey,$scope.faqlists [index]._id).then(function(result){
      console.log(result);
      getfaqlist();

    });
    $scope.faqlists.splice(index, 1);
  };

}]);

app.controller('FAQAddCtrl', ['$scope', 'faqs', '$state', function($scope, faqs, $state) {

  $scope.faqcateory = "";
  $scope.faqcategorys = [];
  faqs.getFaqCategory($scope.user.currentproject.applicationkey).then(function(faqresult){
    console.log(faqresult.return);
    $scope.faqcategorys = faqresult.return;

    $scope.faqcateory = $scope.faqcategorys[0].category;
  });


  $scope.AddFAQ =function(){
    console.log($scope.faqcateory);
    faqs.createFaq($scope.user.currentproject.applicationkey, $scope.faqTitle, $scope.faqBody, $scope.faqcateory.category).then(function(result){
      console.log(result);
      $state.go('app.helpcenter.faq.list');
    });
  };


}]);
