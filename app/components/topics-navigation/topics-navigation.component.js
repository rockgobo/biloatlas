/**
 * Created by CMatyas on 15.12.2015.
 */
/*globals angular:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas').component('topicsNavigation', {
    templateUrl: 'app/components/topics-navigation/topics-navigation.component.html',
    controller: function (TopicData, RegionData, $routeParams, $location) {
      this.topics = []
      this.regions = []

      this.selectedTopicId = $routeParams.topicid
      this.selectedRegionId = $routeParams.regionid

      // Loading all topics and regions
      TopicData.getTopics().then(function (topics) {
        this.topics = topics
      }.bind(this))

      RegionData.getRegions().then(function (regions) {
        //#42 sort by prefix first and then by name
        regions.sort(function(r1, r2){
          console.log(r1)

          var t1 = r1.name
          var t2 = r2.name
          var prefix1 = t1.slice(0,t1.indexOf(" "))
          var prefix2 = t2.slice(0,t2.indexOf(" "))
          var name1 = r1.shortName
          var name2 = r2.shortName

          if(prefix1 == 'Stadt' && prefix2 == 'Lkr.') return -1
          if(prefix1 == 'Lkr.' && prefix2 == 'Stadt') return 1
          else return name1 > name2
        });
        this.regions = regions
      }.bind(this))

      // helpers for finding active selection
      this.activeTopic = function (t) {
        return $location.path() === '/topic/' + t.id
      }

      this.activeRegion = function (r) {
        return $location.path() === '/region/' + r.id || $location.path() === '/location/' + r.id
      }

      this.topicSelected = function () {
        return $location.path().indexOf('topic') !== -1
      }
      this.regionSelected = function () {
        return $location.path().indexOf('region') !== -1 || $location.path().indexOf('location') !== -1
      }

      this.startSelected = function () {
        return !this.topicSelected() && !this.regionSelected()
      }
    }
  })
})()
