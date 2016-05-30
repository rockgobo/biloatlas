/*globals angular:true*/
;(function () {
  'user strict'

  angular.module('biloAtlas')
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: 'app/views/main.html'
        }).when('/topic/:topicid', {
          template: '<div id="topicView"> <topics-collection>Loading...</topics-collection> </div>'
        }).when('/region/:regionid', {
          template: '<div id="regionView"> <region-view>Loading...</region-view> </div>'
        }).when('/impressum', {
          templateUrl: 'app/views/impressum.html'
        }).otherwise({
          redirectTo: '/'
        })
      }])
})()
