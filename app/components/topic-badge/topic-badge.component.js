/*global angular:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('topicBadge', {
      templateUrl: 'app/components/topic-badge/topic-badge.component.html',
      bindings: {
        topic: '<'
      },
      controllerAs: 'topicBadge'
    })
})()
