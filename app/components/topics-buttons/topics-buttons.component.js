/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas').component('topicsButtons', {
    templateUrl: 'app/components/topics-buttons/topics-buttons.component.html',
    controller: function (TopicData, GeoData, $routeParams) {
      this.topics = []
      this.loading = true
      TopicData.getTopics().then(function (topics) {
        this.topics = topics
        this.loading = false
      }.bind(this))

      this.mapData = GeoData.getDataByValue(0,1)
    }
  })
})()
