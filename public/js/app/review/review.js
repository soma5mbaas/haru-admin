/**
 * Created by pheadra on 10/31/14.
 */

Map = function(){
    this.map = new Object();
};
Map.prototype = {
    put : function(key, value){
        this.map[key] = value;
    },
    get : function(key){
        return this.map[key];
    },
    containsKey : function(key){
        return key in this.map;
    },
    containsValue : function(value){
        for(var prop in this.map){
            if(this.map[prop] == value) return true;
        }
        return false;
    },
    isEmpty : function(key){
        return (this.size() == 0);
    },
    clear : function(){
        for(var prop in this.map){
            delete this.map[prop];
        }
    },
    remove : function(key){
        delete this.map[key];
    },
    keys : function(){
        var keys = new Array();
        for(var prop in this.map){
            keys.push(prop);
        }
        return keys;
    },
    values : function(){
        var values = new Array();
        for(var prop in this.map){
            values.push(this.map[prop]);
        }
        return values;
    },
    size : function(){
        var count = 0;
        for (var prop in this.map) {
            count++;
        }
        return count;
    }
};



app.controller('ReviewCtrl', ['$scope', 'reviews', '$state', '$window',
    function($scope,   reviews,   $state,   $window) {

        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }

        function unique(array){
            var o = {}, i, l = array.length, r = [];
            for(i=0; i<l;i+=1) o[array[i]] = array[i];
            for(i in o) r.push(o[i]);
            return r;
        }
        if(isEmpty($scope.user.currentproject)){
            $window.alert('project를 선택해 주십시오!!!');

            console.log($scope.user.currentproject, $state.current.name);
            $state.go('app.projects');
        }


        /* init market data */
        var marketmap = new Map();
        marketmap.put("playGoogle", {name: 'playGoogle', src: '/img/play_logo_x2.png'});
        marketmap.put("amazon", {name: 'amazon', src: '/img/amazon_gray.png'});
        marketmap.put("market360", {name: 'market360', src: '/img/market360.png'});

        var languagemap = new Map();
        languagemap.put("en", {language: 'English', code: 'en'});
        languagemap.put("cn", {language: 'Chinese', code: 'cn'});
        languagemap.put("ko", {language: 'Korean', code: 'ko'});
        languagemap.put("de", {language: 'Germany', code: 'de'});
        languagemap.put("fr", {language: 'France', code: 'fr'});
        languagemap.put("ja", {language: 'Japanese', code: 'ja'});

        var applicationkey = '';
        if (!isEmpty($scope.user.currentproject)) {
            applicationkey = $scope.user.currentproject.applicationkey;
        }

        $scope.summery = {};

        $scope.markets = [];
        $scope.locations = [];
        var Reviewstatistics = [];

        $scope.ratingcircle = [];
        $scope.lineofcount = [];
        $scope.lineticks = [];
        reviews.getReviewStatistics(applicationkey).then(function (result) {
            //console.log(result);

            Reviewstatistics = result.reviews;
            $scope.summery = result.summery;

            if (Reviewstatistics.length > 0) {
                // 첫번째 언어 추출
                $scope.code = Reviewstatistics[0].location;
                // infinite scroll setting
                $scope.reddit = new reviews(applicationkey, Reviewstatistics[0].location);
                $scope.reddit.nextPage();
            }

            var language = [];
            Reviewstatistics.forEach(function (elem) {
                // 언어만 추출..
                language.push(elem.location);

                // 첫번째 언어에 해당하는 마켓 추출
                if (elem.location == $scope.code) {
                    $scope.markets.push(marketmap.get(elem.market));
                }
            });

            language = unique(language);
            language.forEach(function (elem) {
                var lang = languagemap.get(elem);
                if (lang != undefined) {
                    $scope.locations.push(lang);
                }
            });


            // 1번째 그래프
            /* x축 만들기 */
            var lineticks = [];
            for(i = 1; i <= 8; i++){
                lineticks.push([i, moment().subtract(8 - i, 'days').format('MM-DD')]);
            }
            $scope.lineticks = lineticks;
            /* x축을 기준으로 데이터 만들기 */
            var lineofcountdata = [];
            lineticks.forEach(function(elem, index){
                var count = 0;
                for(i = 0; i < result.reviewscount.length; i++ ){
                    if(elem[1] == result.reviewscount[i].date){
                        count = result.reviewscount[i].count;
                        break;
                    }
                }
                lineofcountdata.push([index +1, count]);
            });
            $scope.lineofcount = lineofcountdata;

            // 2번째 그래프
            var pnticks = [];
            for(i = 1; i <= 8; i++){
                pnticks.push([i * 10, moment().subtract(8 - i, 'days').format('MM-DD')]);
            }
            $scope.pnticks = pnticks;

            var negativedatas = [];
            var positivedatas = [];
            var negative = result.graph.negative;
            var positive = result.graph.positive;
            pnticks.forEach(function(elem, index){
                var positivecount = 0;
                for(i = 0; i < positive.length; i++ ){
                    if(elem[1] == positive[i].date){
                        positivecount = positive[i].count;
                        break;
                    }
                }
                positivedatas.push([(index +1) * 10, positivecount]);

                var negativecount = 0;
                for(i = 0; i < negative.length; i++ ){
                    if(elem[1] == negative[i].date){
                        negativecount = negative[i].count;
                        break;
                    }
                }
                negativedatas.push([(index +1) *10, negativecount]);
            });
            $scope.positivedatas = positivedatas;
            $scope.negativedatas = negativedatas;

            console.log(JSON.stringify(positivedatas));
            console.log(JSON.stringify(negativedatas));


            // 3번째 그래프
            $scope.ratingcircle = result.graph.rating;
        }, function (result) {
            console.log(result);
        });



        $scope.d = [[1, 6.5], [2, 6.5], [3, 7], [4, 8], [5, 7.5], [6, 7], [7, 6.8], [8, 7], [9, 7.2], [10, 7], [11, 6.8], [12, 7]];

        $scope.d0_1 = [[0, 7], [1, 6.5], [2, 12.5], [3, 7], [4, 9], [5, 6], [6, 11], [7, 6.5], [8, 8], [9, 7]];

        $scope.d0_2 = [[0, 4], [1, 4.5], [2, 7], [3, 4.5], [4, 3], [5, 3.5], [6, 6], [7, 3], [8, 4], [9, 3]];

        $scope.d1_1 = [[10, 120], [20, 70], [30, 70], [40, 60]];

        $scope.d1_2 = [[10, 50], [20, 60], [30, 90], [40, 35]];



        $scope.currentmarket = '';
        $scope.reviewMarketReflash = function (market) {
            $scope.currentmarket = market.name;

            $scope.reddit = new reviews(applicationkey, $scope.code, $scope.currentmarket);
            $scope.reddit.nextPage();
        }

        $scope.reviewReflash = function (lang) {
            $scope.language = lang.language;
            $scope.code = lang.code;
            $scope.markets = [];
            Reviewstatistics.forEach(function (elem) {

                if (elem.location == lang.code) {
                    $scope.markets.push(marketmap.get(elem.market));
                }
            });

            $scope.currentmarket = "";
            $scope.reddit = new reviews(applicationkey, $scope.code, $scope.currentmarket);
            $scope.reddit.nextPage();
        }


    }]);