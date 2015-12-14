(function () {
    'user strict';

    angular.module('biloAtlas')
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                when('/', {
                    templateUrl: 'app/views/main.html',
                    controller: 'atlasController'
                }).
                when('/topic/:topicid', {
                    templateUrl: 'app/views/topic.html',
                    controller: 'topicController'
                }).
                when('/region/:region', {
                    templateUrl: 'app/views/region.html',
                    controller: 'regionController'
                }).
                otherwise({
                    redirectTo: '/'
                });
            }]);
})();