/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas').component('topicsSelection', {
    templateUrl: 'app/components/topics-selection/topics-selection.component.html',
    bindings: {
      topic: '='
    },
    controller: function (TopicData, RegionData, $routeParams, $location) {
      this.topics = []

      // Loading all topics
      TopicData.getTopics().then(function (topics) {
        this.topics = topics.filter(function (t) { return t.layers.length > 0 && t.id !== $routeParams.topicid })
        if (this.topics.length > 0) {
          this.topic = this.topics[0]
        }
      }.bind(this))
    }
  })
})()
