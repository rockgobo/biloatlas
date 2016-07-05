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
    controller: function (TopicData, Colors, RegionData, Calculations, $routeParams) {
      this.topicId1 = {id: $routeParams.topicid}
      this.topicId2 = {}
      this.additionLayer = false
      this.mapOptions = { stats2: { visible: false } }

      this.minValue
      this.maxValue
      this.minValue2
      this.maxValue2
      this.colors = Colors.getPrimary()
      this.colors2 = Colors.getSecondary()
      this.averageColor1 = '#FFF'
      this.averageColor2 = '#FFF'

      this.layer = []
      this.layer2 = []

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
        this.visibleMap = false
        this.visiblePie = false
        this.visibleTable = false
        this.visibleRing = true
      }

      this.showAdditionalLayer = function () {
        this.mapOptions.stats2.visible = true
        this.additionLayer = true
      }
      this.removeAdditionalLayer = function () {
        this.mapOptions.stats2.visible = false
        this.additionLayer = false
      }

      this.average = function (data) {
        if (data && data.length > 0) {
          var sum = data.reduce(function (p, c) { return p + c })
          var average = parseFloat((sum / data.length) + '').toFixed(1)
          return average
        }
        return 0
      }

      this.average1 = function () {
        if (!this.data1 || this.data1.length === 0) return 0
        var data_ = this.data1.map(function (d) { return d.value })
        var average = this.average(data_)
        if (this.layer.unit.trim() !== '%') {
          average = parseFloat(average).toFixed(0)
        }

        this.maxValue = 0
        this.minValue = Number.MAX_VALUE

        data_.forEach(function (d) {
          if (d > this.maxValue) this.maxValue = Calculations.trim(d, this.layer.unit)
          if (d < this.minValue) this.minValue = Calculations.trim(d, this.layer.unit)
        }.bind(this))
        var regionScale = d3.scale.linear()
          .domain([this.minValue, this.maxValue])
          .range([0, this.colors.length - 1])

        if (average === 0) { this.averageColor1 = '#FFF' } else { this.averageColor1 = this.colors[Math.floor(regionScale(average))] }

        return average
      }
      this.average2 = function () {
        if (!this.data2 || this.data2.length === 0) return 0
        var data_ = this.data2.map(function (d) { return d.value })
        var average = this.average(data_)
        if (this.layer2.unit.trim() !== '%') {
          average = parseFloat(average).toFixed(0)
        }

        this.maxValue2 = 0
        this.minValue2 = Number.MAX_VALUE
        data_.forEach(function (d) {
          if (d > this.maxValue2) this.maxValue2 = Calculations.trim(d, this.layer2.unit)
          if (d < this.minValue2) this.minValue2 = Calculations.trim(d, this.layer2.unit)
        }.bind(this))

        var regionScale = d3.scale.linear()
          .domain([this.minValue2, this.maxValue2])
          .range([0, this.colors2.length - 1])

        if (average === 0) { this.averageColor2 = '#FFF' } else { this.averageColor2 = this.colors2[Math.floor(regionScale(average))] }

        return average
      }
    }
  })
})()
