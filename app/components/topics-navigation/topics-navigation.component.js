/**
 * Created by CMatyas on 15.12.2015.
 */
/*globals angular:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas').component('topicsNavigation', {
    templateUrl: 'app/components/topics-navigation/topics-navigation.component.html',
    controllerAs: 'topicNavigation',
    controller: function ($routeParams, $location, TopicData, RegionData, Calculations) {
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
        regions.sort(Calculations.sortRegions);
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
