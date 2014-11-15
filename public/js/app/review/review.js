/**
 * Created by pheadra on 10/31/14.
 */





app.controller('ReviewCtrl', ['$scope', 'reviews', '$state', '$window',
    function($scope,   reviews,   $state,   $window) {
        console.log('test');
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

            //console.log($scope.user.currentproject, $state.current.name);
            $state.go('app.projects');
        }


        /* init market data */
        var marketmap = new Map();
        marketmap.put("playGoogle", {name: 'playGoogle', src: '/img/play_logo_x2.png'});
        marketmap.put("amazon", {name: 'amazon', src: '/img/amazon_gray.png'});
        marketmap.put("market360", {name: 'market360', src: '/img/market360.png'});
        marketmap.put("tstore", {name: 'tstore', src: '/img/title_tstore.png'});
        marketmap.put("appStore", {name: 'appStore', src: '/img/appstore.png'});


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
        $scope.positivedatas = [];
        $scope.negativedatas = [];
        var lineticks = [];
        for(i = 1; i <= 8; i++){
            lineticks.push([i, moment().subtract(8 - i, 'days').format('MM-DD')]);
        }
        $scope.lineticks = lineticks;
        $scope.reflash = false;

        var csrf = angular.element(document.querySelector('meta[name=csrf-token]')).context.content;
        reviews.getReviewInfo(csrf, applicationkey).then(function (result) {
            console.log(result);

            Reviewstatistics = result.reviews;

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

            console.log($scope.code);
            getReviewgraph($scope.code);
        }, function (result) {
            console.log(result);
        });

        var indexrefresh = 0;
        var getReviewgraph = function(code) {
            var csrf = angular.element(document.querySelector('meta[name=csrf-token]')).context.content;

            reviews.getReviewStatistics(csrf, applicationkey, code).then(function (result) {
                //console.log(result);
                $scope.summery = result.summery;

                // 1번째 그래프
                /* x축 만들기 */

                /* x축을 기준으로 데이터 만들기 */
                var lineofcountdata = [];
                lineticks.forEach(function (elem, index) {
                    var count = 0;
                    for (i = 0; i < result.reviewscount.length; i++) {
                        if (elem[1] == result.reviewscount[i].date) {
                            count = result.reviewscount[i].count;
                            break;
                        }
                    }
                    lineofcountdata.push([index + 1, count]);
                });
                $scope.lineofcount = lineofcountdata;

                // 2번째 그래프
                var pnticks = [];
                for (i = 1; i <= 8; i++) {
                    pnticks.push([i * 10, moment().subtract(8 - i, 'days').format('MM-DD')]);
                }
                $scope.pnticks = pnticks;

                var negativedatas = [];
                var positivedatas = [];

                var negative = result.graph.negative;
                var positive = result.graph.positive;
                pnticks.forEach(function (elem, index) {
                    var positivecount = 0;
                    for (i = 0; i < positive.length; i++) {
                        if (elem[1] == positive[i].date) {
                            positivecount = positive[i].count;
                            break;
                        }
                    }
                    positivedatas.push([(index + 1) * 10, positivecount]);

                    var negativecount = 0;
                    for (i = 0; i < negative.length; i++) {
                        if (elem[1] == negative[i].date) {
                            negativecount = negative[i].count;
                            break;
                        }
                    }
                    negativedatas.push([(index + 1) * 10, negativecount]);

                });
                $scope.positivedatas = positivedatas;
                $scope.negativedatas = negativedatas;

                //console.log(JSON.stringify(positivedatas));
                //console.log(JSON.stringify(negativedatas));

                // 3번째 그래프
                $scope.ratingcircle = result.graph.rating;
                $scope.graphreflash = indexrefresh++;
            }, function (error) {
                console.log(error);
            });
        }

        $scope.currentmarket = '';
        $scope.reviewMarketReflash = function (market) {
            $scope.currentmarket = market.name;

            $scope.reddit = new reviews(applicationkey, $scope.code, $scope.currentmarket);
            $scope.reddit.nextPage();
        }

        $scope.reviewReflash = function (lang) {
            $scope.language = lang.language;
            $scope.code = lang.code;
            getReviewgraph($scope.code);
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