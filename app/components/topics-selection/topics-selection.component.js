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
    controller: function (TopicData, RegionData, $routeParams) {
      this.topics = []

      // Loading all topics
      TopicData.getTopics().then(function (topics) {
        this.topics = topics.filter(function (t) { return (t.layers.length > 0 || t.layerGroups.length > 0) })
        if (this.topics.length > 0 ) {
          //If a topic is set as route parameter try to lookup the topic with the same id
          var topic_id = $routeParams.topicid ? $routeParams.topicid : false
          var topic = this.topics.find(function(t){ return topic_id == t.id })
          if(topic === undefined){
            this.topic = this.topics[0]
          }
          this.topic = topic
        }
      }.bind(this))
    }
  })
})()
