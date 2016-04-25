/*globals angular:true*/
;(function () {
  'user strict'

  angular.module('biloAtlas')
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: 'app/views/main.html'
        }).when('/topic/:topicid', {
          template: '<topics-collection></topics-collection>',
        }).when('/region/:regionid', {
          template: '<region-view></region-view>',
        }).when('/impressum', {
          templateUrl: 'app/views/impressum.html'
        }).otherwise({
          redirectTo: '/'
        })
      }])
})()
