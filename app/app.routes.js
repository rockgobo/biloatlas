/*globals angular:true*/
;(function () {
  'user strict'

  angular.module('biloAtlas')
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: 'app/views/main.html'
        }).when('/topic/:topicid', {
          template: '<div id="topicView"> <topics-collection>Lade...</topics-collection> </div>'
        }).when('/region/:regionid', {
          template: '<div id="regionView"> <region-view>Lade...</region-view> </div>'
        }).when('/location/:id', {
          template: '<div id="locationView"> <locations-view>Lade...</locations-view> </div>'
        }).when('/impressum', {
          templateUrl: 'app/views/impressum.html'
        }).when('/admin', {   //ADMIN
          template: '<admin-dashboard>Lade...</admin-dashboard>'
        }).when('/admin/topics/', {   //ADMIN ROUTE: Topics
          template: '<admin-topics>Lade...</admin-topics>'
        }).when('/admin/topic/:id', {   //ADMIN ROUTE: Topic
          template: '<admin-topic>Lade...</admin-topic>'
        }).when('/admin/layers/', {   //ADMIN ROUTE: Layers
          template: '<admin-layers>Lade...</admin-layers>'
        }).when('/admin/layer/:id', {   //ADMIN ROUTE: Layer
          template: '<admin-layer>Lade...</admin-layer>'
        }).when('/admin/values/:id', {   //ADMIN ROUTE: Values
          template: '<admin-values>Lade...</admin-values>'
        }).otherwise({
          redirectTo: '/'
        })
      }])
})()
