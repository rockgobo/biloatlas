/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas').component('topicsButtons', {
    templateUrl: 'app/components/topics-buttons/topics-buttons.component.html',
    controller: function (TopicData, GeoData, $routeParams) {
      this.chunkedTopics = []
      this.loading = true
      TopicData.getTopics().then(function (topics) {
        topics = topics
                    //.filter(function (t) { return t.layers.length > 0 || t.layerGroups.length > 0 })
                    //.sort(function (a, b) { return a.layers.length < b.layers.length })
        this.chunkedTopics = chunk(topics, 3)
        this.loading = false
      }.bind(this))

      this.mapData = GeoData.getDataByValue(0,1)

      function chunk (arr, size) {
        var newArr = []
        for (var i = 0; i < arr.length; i += size) {
          newArr.push(arr.slice(i, i + size))
        }
        return newArr
      }
    }
  })
})()
