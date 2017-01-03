/*globals angular:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('topicView', {
      templateUrl: 'app/components/topic-view/topic-view.component.html',
      bindings: {
        topic: '=',
        data: '=?',
        average: '&',
        layer: '=?'
      },
      controllerAs: 'topicView',
      controller: function (TopicData, GeoData, Calculations, $scope) {
        this.layer = []
        this.selection = 0
        this.years = []
        this.year = false
        this.topic_ = {}

        this.data_ = []

        this.filterData = function () {
          // #71: Merge the filtered data to a basic data table with 0 for each region
          // Maybe use a method with faster computation
          var basic_data = GeoData.getDataByValue(0,0,this.year,0)
          var data = this.data_.filter(function (d) {
            return d.year === this.year
          }.bind(this))
          //this.data = angular.merge(basic_data, data)
          //Merge data into basic_data
          this.data = basic_data.map(function (d1) {
              var d2 = data.find(function (element) { return element.id === d1.id })
              if (d2) {
                d1.value = d2.value
                d1.name = d2.name
                d1.shortName = d2.shortName
              }
              return d1
            })
          
          console.log(this.data)
        }

        // Watch topic
        // If topic changes select the first layer if possible
        $scope.$watch('topicView.topic', function (topic) {
          if (topic === undefined || topic.id === undefined) return
          TopicData.getTopicById(topic.id).then(function (t) {
            this.topic_ = t
            this.topic.name = t.name
            if (this.topic_.layers.length > 0) {
              this.selectLayer(this.topic_.layers[0])
            } else {
              if (this.topic_.layerGroups !== undefined) {
                for (var i = 0; i < this.topic_.layerGroups.length; ++i) {
                  if (this.topic_.layerGroups[i].layers.length > 0) {
                    this.selectLayer(this.topic_.layerGroups[i].layers[0])
                    break
                  }
                }
              }
            }
          }.bind(this))
        }.bind(this))

        $scope.$watch('topicView.layer', function (layer) {
          this.selectLayer(layer)
        }.bind(this))

        // Functions
        this.selectLayer = function (layer) {
          layer.unit = layer.unit == null ? '' : layer.unit

          this.layer = layer
          this.years = []

          this.topic.layerName = layer.name

          if (layer.data) {
            layer.data.forEach(function (d) {
              if (this.years.indexOf(d.year) === -1) {
                this.years.push(d.year)
              }
            }.bind(this))

            this.years.sort()
            this.year = this.years[this.years.length - 1]

            this.data_ = layer.data
            this.filterData()
          } else {
            this.data_ = []
          }
        }
        this.layerVisible = function (id) {
          return id === this.layer.id
        }

        this.unit = function () {
          if (this.layer === undefined) return
          return this.layer.unit
        }

        this.average = function () {
          var data = []
          if (this.data && this.data.length > 0) {
            data = this.data.map(function (d) { return d.value })
          }
          return Calculations.average(data, this.layer.unit)
        }

        this.switchYearLast = function () {
          var index = this.years.indexOf(this.year)
          if (index === 0) return
          this.year = this.years[index - 1]
          this.filterData()
        }
        this.switchYearNext = function () {
          var index = this.years.indexOf(this.year)
          if (index === this.years.length - 1) return
          this.year = this.years[index + 1]
          this.filterData()
        }
        this.switchYearLastEnbled = function () {
          return this.years.indexOf(this.year) > 0
        }
        this.switchYearNextEnbled = function () {
          return this.years.indexOf(this.year) < this.years.length - 1
        }
      }
    })
})()
