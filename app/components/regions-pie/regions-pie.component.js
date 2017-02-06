/*globals angular:true d3:true d3pie:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .directive('regionsPie', function (ColorBrewer) {
      return {
        restrict: 'EA',
        scope: {
          stats: '=',
          schemecolors: '='
        },
        templateUrl: 'app/components/regions-pie/regions-pie.component.html',
        link: function (scope, element, attrs) {
          var checkData = function(data){
            console.log(data)
            // Check if all values are possitve 
            var nonvaliddata = data.find(function(d){ return data.value < 0})
            if( nonvaliddata < 0 ){ 
              console.log('Pie component: data contains a non valid information ('+nonvaliddata+')')
              return false
             }

            return true
          }
          
          scope.render = function (data) {
            var colors = scope.schemecolors
            var regionScale = d3.scale.linear()
              .domain([0, scope.maxValue])
              .range([0, colors.length - 1])
            var regionColors = function (value) {
              if (value === 0) return '#FFF'
              return colors[Math.floor(regionScale(value))]
            }
            scope.regionColors = ['#FFF'].concat(colors)

            data = data.map(function (i) { return {label: i.name, value: i.value, color: regionColors(i.value)} })

            /** ****************************
             *             D3
             *******************************/

            // Remove Pie if it already exists ... redraw is currently not possible (https://github.com/benkeen/d3pie/issues/48)
            if (scope.pie) scope.pie.destroy()

            //check if data is valid
            if (!checkData(data)) {
              return            
            }

            scope.pie = new d3pie('regions-pie', {
              header: {
                title: {
                  text: ''
                },
                location: 'pie-center'
              },
              data: {
                sortOrder: 'value-desc',
                content: data
              },
              size: {
                canvasHeight: 400,
                canvasWidth: 550,
                pieInnerRadius: 0,
                pieOuterRadius: '90%'
              },
              labels: {
                outer: {
                  format: 'label-value2'
                },
                inner: {
                  format: 'none'
                },
                mainLabel: {
                  color: '#333',
                  font: 'arial',
                  fontSize: 11
                }
              },
              tooltips: {
                enabled: true,
                type: 'placeholder',
                string: '{label} {value}'
              }
            })
          }

          scope.$watch('stats', function (data) {
            // Calculate max using all years
            scope.maxValue = 0
            if (data === undefined || data.length === 0) {
              return
            }
            data.forEach(
              function (d) { if (d.value > scope.maxValue) scope.maxValue = d.value }
            )

            scope.render(data)
          })

          scope.$watch('schemecolors', function (year) {
            if (scope.stats === undefined || scope.stats.length === 0) {
              return
            }
            scope.render(scope.stats)
          })
        }
      }
    }
  )
})()
