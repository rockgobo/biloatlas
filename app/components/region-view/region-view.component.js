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
        this.hasRegionData = function(id){
          var regionData =  this.getLayerData(id).find(function(d){
            return d.key !== 'Oberfranken'
          })
          return regionData.values.length === 0 
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
              var count = layer.data.length
              if(count === 0){
                count = layer.dataUF.length
              }

              layer.unit = layer.unit?layer.unit:''
              if(layer.data.length){
                layerData.push(
                  { values: layer.data.map(function (d) { return { value: d.value, year: d.year } }), 
                    key: regionTopics.region.name })
              }
              //Add values for upper frankconia, if available
              if(layer.dataUF && layer.dataUF.length > 0) { 
                layerData.push(
                  {
                    values: layer.dataUF.map(function (d) { return { value: d.value, year: d.year } }), 
                    key: 'Oberfranken', 
                    color: Colors.getPrimaryColor()
                  })
              }
              layer.data.map(function(d){
                if (d.value > max) max = d.value 
                if (d.value < min) min = d.value
              })
              layer.dataUF.map(function(d){
                if (d.value > max) max = d.value 
                if (d.value < min) min = d.value
              })


              if (isLongitudinalData(layer.data, layer.dataUF)) {
                var options = getOptions(layer.name, layer.unit, min, max, layer.decimals)
                if(isContinous(layer.data)){
                  options.chart.type = 'lineChart'
                }
                layersData[layer.id] = {options: options, data: layerData}
              } else {
                layersData[layer.id] = {options: getBarOptions(layer.name, layer.unit, count, min, max, layer.decimals), data: layerData}
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

        /**
         * #171 add Euro to layer name
         */
        var getUnit = function(unit){
          if(unit.trim() === '€'){
            return ' [€]'
          }
          return ''
        }

        function getOptions (name, unit, min, max, decimals) {
          
          var diagram_height = name.length * 7
          if (diagram_height < 250) diagram_height = 250
          
          var yDomainMax =  Math.floor(max) + (0.1 * max)
          if(yDomainMax < 0 ) yDomainMax = 0
          
          var yDomainMin =  Math.floor(min) - (0.1 * Math.abs(min)) - 0.5

          // set y-domain for % (charm #106)
          if(unit.trim() === '%'){
            if(max < 10){
              yDomainMax = 20
            }
            else if(max < 40){
              yDomainMax = 50
            }
            else{
              yDomainMax = 100
            }
          }

          return {
            chart: {
              noData: "Leider keine Daten verfügbar",
              type: 'scatterChart',
              height: diagram_height,
              margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 90
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
                axisLabel: name +getUnit(unit),
                axisLabelDistance: 10,
                showMaxMin: false
                //,tickFormat: function(d) {return d + ' ' + ((unit.length < 3)?unit:'')}
              },
              // THIS is the important one you can specify an array the min and max value the x axis will have
              yDomain: [yDomainMin, yDomainMax],
              callback: function (chart) {},
              color: function (d, i) {
                if (i === 1) return Colors.getPrimaryColor()
                if (i === 0) return Colors.getSecondaryColor()
                return Colors.getSecondaryColor()
              },
              tooltip: {
                valueFormatter: function(d){
                  return $filter('numberValue')(d, decimals)
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

        function getBarOptions (name, unit, count, min, max, decimals) {
          return {
            chart: {
              noData: "Leider keine Daten verfügbar",
              type: 'multiBarHorizontalChart',
              height: (count * 60) + 100,
              showControls: false,
              showValues: false,
              duration: 500,
              xAxis: {
                showMaxMin: false
              },
              yAxis: {
                axisLabel: name,
                showMaxMin: true,
                tickFormat: function(d) {
                  return $filter('numberValue')(d, decimals)+((unit && unit.length < 3) ? unit : '')
                },
                tickSubdivide: 0,
                ticks: 0
              },
              x: function (d) { return d.year },
              y: function (d) { return d.value },
              yDomain: [min,max],
              color: function (d, i) {
                if (i === 1) return Colors.getPrimaryColor()
                if (i === 0) return Colors.getSecondaryColor()
                return Colors.getSecondaryColor()
              },
              tooltip: {
                valueFormatter: function(d){
                  return $filter('numberValue')(d, decimals)
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
