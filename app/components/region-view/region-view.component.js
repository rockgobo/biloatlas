/*global angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('regionView', {
      templateUrl: 'app/components/region-view/region-view.component.html',
      binding: {},
      controllerAs: 'regionView',
      controller: function ($filter, $routeParams, $location, Calculations, RegionData, PoiData, Colors, GeoData) {
        this.topics = []
        this.selection = $routeParams.regionid
        this.regionid = $routeParams.regionid
        this.colorSchema = [Colors.getPrimaryColor(), Colors.getSecondaryColor()]

        this.mapData = GeoData.getDataByValue(this.regionid, 100)

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
            this.regions = regions.filter(function (r) { return r.id !== this.regionid }.bind(this))
          }.bind(this)
        )

        this.region = {name: '.'}
        RegionData.getRegionById(this.regionid).then(function (regionTopics) {
          // Prepare data for linecharts
          var layersData = []
          this.region = regionTopics.region

          // Prepare for each topic 
          regionTopics.topics.forEach(function (topic) {
            topic.layers.forEach(function (layer) {
              var layerData = []
              var min = 0 // set minumum to default zero
              var max = -99999999999999999
          
              layer.unit = layer.unit?layer.unit:''
              layerData.push({values: layer.data.map(function (d) { return { value: Calculations.trim(d.value, layer.unit), year: d.year } }), key: regionTopics.region.name})
              //Add values for upper frankconia, if available
              if(layer.dataUF && layer.dataUF.length > 0) layerData.push({values: layer.dataUF.map(function (d) { return { value: Calculations.trim(d.value, layer.unit), year: d.year } }), key: 'Oberfranken', color: Colors.getPrimaryColor()})
              layer.data.map(function(d){
                if (d.value > max) max = d.value 
                if (d.value < min) min = d.value
              })
              layer.dataUF.map(function(d){
                if (d.value > max) max = d.value 
                if (d.value < min) min = d.value
              })
              if (isLongitudinalData(layer.data, layer.dataUF)) {
                var options = getOptions(layer.name, layer.unit, min, max)
                if(isContinous(layer.data)){
                  options.chart.type = 'lineChart'
                }
                layersData[layer.id] = {options: options, data: layerData}
              } else {
                layersData[layer.id] = {options: getBarOptions(layer.name, layer.unit, layer.data.length), data: layerData}
              }
            })
          })

          this.layersData = layersData
          this.topics = regionTopics.topics

          this.mapData = GeoData.getDataByValue(regionTopics.region.id, 100)
        }.bind(this))

        PoiData.getPoisByRegion(this.regionid).then(function (response) {
          this.pois = response.features
        }.bind(this))

        /**
         * Private functions
         * 
         */
        function getOptions (name, unit, min, max) {
          
          var diagram_height = name.length * 7
          if (diagram_height < 250) diagram_height = 250
          
          var yDomainMax =  Math.floor(max) + (0.1 * max)
          if(yDomainMax < 0 ) yDomainMax = 0

          return {
            chart: {
              type: 'scatterChart',
              height: diagram_height,
              margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 65
              },
              x: function (d) { return d.year },
              y: function (d) { return d.value },
              dispatch: {
                stateChange: function (e) { console.log('stateChange') },
                changeState: function (e) { console.log('changeState') },
                tooltipShow: function (e) { console.log('tooltipShow') },
                tooltipHide: function (e) { console.log('tooltipHide') }
              },
              xAxis: {
                axisLabel: 'Jahr',
                showMaxMin: true
              },
              yAxis: {
                axisLabel: name,
                axisLabelDistance: 0,
                showMaxMin: false
                //,tickFormat: function(d) {return $filter('numberUnit')(d, unit)+((unit.length < 3)?unit:'')}
              },
              // THIS is the important one you can specify an array the min and max value the x axis will have
              yDomain: [Math.floor(min)-1, yDomainMax],
              callback: function (chart) {},
              color: function (d, i) {
                if (i === 1) return Colors.getPrimaryColor()
                if (i === 0) return Colors.getSecondaryColor()
                return Colors.getSecondaryColor()
              },
              tooltip: {
                valueFormatter: function(d){
                  return $filter('numberUnit')(d, unit)
                }
              }
            },
            title: {
              enable: false
            },
            subtitle: {
              enable: false
            },
            caption: {
              enable: false,
              html: '<div class="chart_caption">' + name + '</div>'
            }
          } 
        } 

        function getBarOptions (name, unit, count) {
          return {
            chart: {
              type: 'multiBarHorizontalChart',
              height: (count * 60) + 100,
              showControls: false,
              showValues: false,
              duration: 500,
              xAxis: {
                showMaxMin: false,
              },
              yAxis: {
                axisLabel: name,
                tickFormat: function(d) {
                  return $filter('numberUnit')(d, unit)+((unit && unit.length < 3) ? unit : '')
                }
              },
              x: function (d) { return d.year },
              y: function (d) { return d.value },
              color: function (d, i) {
                if (i === 1) return Colors.getPrimaryColor()
                if (i === 0) return Colors.getSecondaryColor()
                return Colors.getSecondaryColor()
              },
              tooltip: {
                valueFormatter: function(d){
                  return $filter('numberUnit')(d, unit)
                }
              }
            }
          }
        }

        //checks the data if the data has values from each year
        function isLongitudinalData(data, dataUF){
          return data.length > 2 || dataUF.length > 2
        }

        function isContinous(data){
          data = data.sort(function(a,b){return b.year > a.year ? -1 : 1})
          var lastYear = 0
          for(var i = 0; i <data.length; ++i){
            var d = data[i]
            if(i === 0) { 
              lastYear = d.year
            } else if (d.year - lastYear > 1){
                return false
            }
            lastYear = d.year
          }
          return true
        }

      }
    })
})()
