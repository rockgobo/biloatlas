/*global angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('regionView', {
      templateUrl: 'app/components/region-view/region-view.component.html',
      binding: {},
      controllerAs: 'regionView',
      controller: function (RegionData, GeoData, $routeParams) {
        this.topics = []
        this.selection = 0
        this.regionid = $routeParams.regionid

        this.options = {
          chart: {
            type: 'lineChart',
            height: 250,
            margin: {
              top: 20,
              right: 20,
              bottom: 40,
              left: 55
            },
            x: function (d) { return d.year },
            y: function (d) { return d.value },
            useInteractiveGuideline: true,
            dispatch: {
              stateChange: function (e) { console.log('stateChange') },
              changeState: function (e) { console.log('changeState') },
              tooltipShow: function (e) { console.log('tooltipShow') },
              tooltipHide: function (e) { console.log('tooltipHide') }
            },
            xAxis: {
              axisLabel: 'Jahr'
            },
            yAxis: {
              axisLabel: '%',
              axisLabelDistance: -10
            },
            callback: function (chart) {}
          },
          title: {
            enable: false
          },
          subtitle: {
            enable: false
          },
          caption: {
            enable: false
          }
        }


        this.getLayerData = function (id) {
          return this.layersData[id].data
        }
        this.getLayerOptions = function (id) {
          return this.layersData[id].options
        }

        this.regions = []
        RegionData.getRegions().then(
          function (regions) {
            this.regions = regions
          }.bind(this)
        )

        RegionData.getRegionById(this.regionid).then(function (regionTopics) {
          // Prepare data for linecharts
          var layersData = []
          regionTopics.topics.forEach(function (topic) {
            topic.layers.forEach(function (layer) {
              var layerData = []
              layerData.push({values: layer.data.map(function (d) { return { value: d.value, year: d.year } }), key: layer.name})
              layerData.push({values: layer.data.map(function (d) { return {value: d.averageUF.toPrecision(2), year: d.year} }), key: 'Oberfranken', color: '#CCC'})
              layersData[layer.id] = {options: getOptions(layer.name, layer.unit), data: layerData}
            })
          })

          this.layersData = layersData
          this.topics = regionTopics.topics
          this.region = regionTopics.region

          this.mapData = GeoData.getDataByValue(regionTopics.region.id, 100)

        // [{id: regionTopics.region.id, name: this.region, value: 100, year: 0}]
        }.bind(this))


        function getOptions (name, unit) {
          return {
            chart: {
              type: 'lineChart',
              height: 250,
              margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
              },
              x: function (d) { return d.year },
              y: function (d) { return d.value },
              useInteractiveGuideline: true,
              dispatch: {
                stateChange: function (e) { console.log('stateChange') },
                changeState: function (e) { console.log('changeState') },
                tooltipShow: function (e) { console.log('tooltipShow') },
                tooltipHide: function (e) { console.log('tooltipHide') }
              },
              xAxis: {
                axisLabel: 'Jahr'
              },
              yAxis: {
                axisLabel: unit,
                axisLabelDistance: -10
              },
              callback: function (chart) {}
            },
            title: {
              enable: false
            },
            subtitle: {
              enable: false
            },
            caption: {
              enable: true,
              html: '<div class="chart_caption">' + name + '</div>'

            }
          }
        }
    }})
})()
