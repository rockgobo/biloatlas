/*globals angular:true d3:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas').component('topicsCollection', {
    templateUrl: 'app/components/topics-collection/topics-collection.component.html',
    bindings: {
      data1: '=?',
      data2: '=?'
    },
    controllerAs: 'topicsCollection',
    controller: function ($filter, $routeParams, TopicData, Colors, RegionData, Calculations) {
      this.topicId1 = {id: $routeParams.topicid}
      this.topicId2 = {}
      this.additionLayer = false

      this.colors = Colors.getPrimary()
      this.colors2 = Colors.getSecondary()
      this.averageColor1 = '#FFF'
      this.averageColor2 = '#FFF'

      this.layer = []
      this.layer2 = []

      this.year = ''
      this.year2 = ''

      this.visibleMap = true
      this.visiblePie = false
      this.visibleTable = false
      this.visibleRing = false

      this.showMap = function () {
        this.visibleMap = true
        this.visiblePie = false
        this.visibleTable = false
        this.visibleRing = false
      }
      this.showPie = function () {
        this.visibleMap = false
        this.visiblePie = true
        this.visibleTable = false
        this.visibleRing = false
      }
      this.showTable = function () {
        this.visibleMap = false
        this.visiblePie = false
        this.visibleTable = true
        this.visibleRing = false
      }
      this.showRing = function () {
        // Don´t show ring if data contains negative values
        if(this.minValue() < 0) return

        this.visibleMap = false
        this.visiblePie = false
        this.visibleTable = false
        this.visibleRing = true
      }

      this.mapOptions = { stats2: { visible: false }, unit: '', decimals: 0 }

      this.showAdditionalLayer = function () {
        this.mapOptions.stats2.visible = true
        this.additionLayer = true
      }
      this.removeAdditionalLayer = function () {
        this.mapOptions.stats2.visible = false
        this.additionLayer = false
      }

      this.average = function (data) {
        //TODO: Read average from the data instead of calculating  it
        return 0
      }

      this.minValue = function(){
        if (!this.data1 || this.data1.length === 0) return 0
        var data_ = this.data1.map(function (d) { return d.value })
        var min = Number.MAX_VALUE

        data_.forEach(function (d) {
          if (d < min) min = d
        })

        return min
      }

      this.minValue2 = function(){
        if (!this.data2 || this.data2.length === 0) return 0
        var data_ = this.data2.map(function (d) { return d.value })
        var min = Number.MAX_VALUE

        data_.forEach(function (d) {
          if (d < min) min = d
        })

        return min
      }

      this.maxValue = function(){
        if (!this.data1 || this.data1.length === 0) return 0
        var data_ = this.data1.map(function (d) { return d.value })
        var max = 0

        data_.forEach(function (d) {
          if (d > max) max = d
        })

        return max
      }

      this.maxValue2 = function(){
        if (!this.data2 || this.data2.length === 0) return 0
        var data_ = this.data2.map(function (d) { return d.value })
        var max = 0

        data_.forEach(function (d) {
          if (d > max) max = d
        })
        return max
      }
    }
  })
})()
