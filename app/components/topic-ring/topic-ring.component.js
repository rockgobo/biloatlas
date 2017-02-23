/*global angular:true d3:true $:true lifbi:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .directive('topicRing', function ($filter, ColorBrewer, GeoData, Calculations) {
      return {
        restrict: 'EA',
        scope: {
          data: '=',
          schemecolors: '='
        },
        templateUrl: 'app/components/topic-ring/topic-ring.component.html',
        link: function (scope, element, attrs) {

          /**
           * return true if the data is valid for a pie diagram
           * else false
           */
          function checkData(data){
            scope.message = ""

            if(data === undefined) return false
            if(data.isArray && data.length === 0 ) return true

            // Check if all values are possitve 
            var nonvaliddata = data.find(function(d){ return d.value < 0})
            if(nonvaliddata && nonvaliddata.value < 0 ){ 
              console.log('Pie component: data contains a non valid information ('+nonvaliddata.name+' '+nonvaliddata.value+')')
              return false
             }
             return true
          }
          /*   SETTINGS
          ---------------------------------------------------------------*/

          /**
           * D3 expects updated data in the same sort order as the
           * original data, it also has to be the same length.
           */
          function prepareData (data_) {
            /**
             * Defaults (IE support)
             */
            if (!data_) data_ = []

            var data_template = GeoData.getDataByValue(0, 0, 0, 0)
            return data_template.map(function (d1) {
              var d2 = data_.find(function (element) { return element.id === d1.id })
              if (d2) {
                d1.value = d2.value
                d1.name = d2.name
                d1.shortName = d2.shortName
                d1.isMissing = d2.isMissing
              }
              return d1
            })
          }

          var width = element[0].clientWidth
          var height = 600
          var svg = d3.select(element[0]).select('#topic-ring').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')

          svg.append('g')
            .attr('class', 'slices2')
          svg.append('g')
            .attr('class', 'slices')
          svg.append('g')
            .attr('class', 'labels')
          svg.append('g')
            .attr('class', 'lines')
          svg.append('g')
            .attr('class', 'connections')

          /** *************************
           *  SHADOW FILTER
           **************************/
          var defs = svg.append('defs')

          var filter = defs.append('filter')
            .attr('id', 'dropshadow')

          filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3)
            .attr('result', 'offset-blur')
          filter.append('feOffset')
            .attr('dx', 0)
            .attr('dy', 0)
          filter.append('feComposite')
            .attr('operator', 'out')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'offset-blur')
            .attr('result', 'inverse')
          filter.append('feFlood')
            .attr('flood-color', 'black')
            .attr('floot-opacity', '1')
            .attr('result', 'color')
          filter.append('feComposite')
            .attr('operator', 'in')
            .attr('in', 'color')
            .attr('in2', 'inverse')
            .attr('result', 'shadow')

          filter.append('feComposite')
            .attr('operator', 'over')
            .attr('in', 'shadow')
            .attr('in2', 'SourceGraphic')


          var radius = Math.min(width-100, height-100) / 2
          var radius2 = (Math.min(width-100, height-100) / 4)

          var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
              return d.value
            })
          var pie2 = d3.layout.pie()
            .sort(null)
            .value(function (d) {
              return d.value
            })

          var arc = d3.svg.arc()
            .outerRadius(radius * 0.7)
            .innerRadius(radius * 0.45)

          var outerArc = d3.svg.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

          var arc2 = d3.svg.arc()
            .outerRadius(radius2 * 0.65)
            .innerRadius(radius2 * 0.4)

          svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

          var key = function (d) { return d.data.name }

          var regionScale1 = function (value) { return 0 }
          var regionColors1 = function (value) {
            if (value === 0) return '#FFF'
            return scope.schemecolors[0][Math.floor(regionScale1(value))]
          }

          var regionScale2 = function (value) { return 0 }
          var regionColors2 = function (value) {
            if (value === 0) return '#FFF'
            return scope.schemecolors[1][Math.floor(regionScale2(value))]
          }

          /*   RENDER METHODS
          ---------------------------------------------------------------
          */

          scope.render = function (data_, data2_) {
            // prepare data2
            var data = prepareData(data_)
            var data2 = []
            if (Array.isArray(data2_) && data2_.length > 0) {
              data2 = prepareData(data2_)
            }

            //checkdata
            if(!checkData(data)){ data = [] }
            if(!checkData(data2)){ data2 = [] }
            
            // diagram is not valid if the outer circle has less valid data than the inner circle
            if(data2.length > 0){
                if(data.filter(function(v){return v.value > 0}).length < data2.filter(function(v){return v.value > 0}).length){
                  scope.message = "Der Vergleich dieser Kennzahlen ist leider in einem Ringdiagramm nicht möglich. Bitte wählen sie eine andere Visualisierung."
                  data2 = []
                }
             }


            regionScale1 = d3.scale.linear()
              .domain([d3.min(data, function (d) { return d.value }), d3.max(data, function (d) { return d.value })])
              .range([0, scope.schemecolors[0].length - 1])

            regionScale2 = d3.scale.linear()
              .domain([d3.min(data2, function (d) { return d.value }), d3.max(data2, function (d) { return d.value })])
              .range([0, scope.schemecolors[1].length - 1])

            change(data, data2)
          }

          function change (data, data2) {
            /* ------- PIE SLICES -------*/
            var slice = svg.select('.slices').selectAll('path.slice')
              .data(pie(data), key)

            slice.enter()
              .insert('path')
              .style('stroke', 'white')
              .style('fill', function (d) { return regionColors1(d.data.value) })
              .attr('class', function (d) { return 'slice region_' + d.data.id })
              .attr('title', function (d) { return $filter('numberUnit')(d.data.value, scope.unit) })
              .on('mouseover', function (d) {
                lifbi.tooltip.showTooltip(d.data.shortName + ": " + d.data.value.toFixed(1))
                $('.region_' + d.data.id).css('stroke', 'gray').css('stroke-width', '2px')
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.hideTooltip()
                $('.region_' + d.data.id).css('stroke', 'white').css('stroke-width', '1px')
              })

            slice
              .transition().duration(1000)
              .style('fill', function (d) { return regionColors1(d.data.value) })
              .attrTween('d', function (d) {
                this._current = this._current || d
                var interpolate = d3.interpolate(this._current, d)
                this._current = interpolate(0)
                return function (t) {
                  return arc(interpolate(t))
                }
              })

            slice.exit()
              .remove()

            /* ------- PIE SLICES 2 -------*/
            if (data2 === undefined) data2 = data
            var slice2 = svg.select('.slices2').selectAll('path.slice')
              .data(pie2(data2), key)

            slice2.enter()
              .insert('path')
              .style('stroke', 'white')
              .style('fill', function (d) { return regionColors2(d.data.value) })
              .attr('class', function (d) { return 'slice region_' + d.data.id })
              .on('mouseover', function (d) {
                $('.region_' + d.data.id).css('stroke', 'gray').css('stroke-width', '2px')
                $('.connection_' + d.data.id).css('stroke', 'yellow')
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.showTooltip(d.data.value.toFixed(1))
                $('.region_' + d.data.id).css('stroke', 'white').css('stroke-width', '1px')
                $('.connection_' + d.data.id).css('stroke', '')
              })

            slice2
              .transition().duration(1000)
              .style('fill', function (d) { return regionColors2(d.data.value) })
              .attrTween('d', function (d) {
                this._current = this._current || d
                var interpolate = d3.interpolate(this._current, d)
                this._current = interpolate(0)
                return function (t) {
                  return arc2(interpolate(t))
                }
              })

            slice2.exit()
              .remove()

            /* ------- TEXT LABELS -------*/
            var text = svg.select('.labels').selectAll('g')
              .data(pie(data), key)
              .attr('class', function(d){
                if(d.data.value == 0 || d.data.isMissing){ // remove region if value == 0
                  return 'nodata'
                }
              })

            /* Text enter */
            text.enter()
              .append('g')
              .attr('dy', '.35em')
              .append('text')
              .text(function (d) {
                return d.data.shortName
              })
              .select(function () { return this.parentNode })
              .append('text')
              .attr('dy', 12)
              .attr('class', 'value-label')

            /* Update label */
            text.select('.value-label')
              .text(function (d) {
                //remove labels for small angles
                if(d.endAngle - d.startAngle < 0.2){
                  return ""
                }

                var d2 = data2.find(function (d2) {
                  return d2.id === d.data.id
                })
                if (d2 === undefined) {
                  return $filter('numberUnit')(d.data.value, scope.unit) + $filter('singularUnit')(scope.unit, d.value)
                }
                return $filter('numberUnit')(d.data.value, scope.unit) + ' (' + $filter('numberUnit')(d2.value, scope.unit2) + $filter('singularUnit')(scope.unit2, d2.value) + ')'
              })

            function midAngle (d) {
              return d.startAngle + (d.endAngle - d.startAngle) / 2
            }
            function elipsoidCoordination(d){
              var angle = midAngle(d)
              return [0.9 * radius * Math.sin( angle ), -1 * radius * Math.cos( angle )]
            }

            text.transition().duration(1000)
              .attrTween('transform', function (d) {
                this._current = this._current || d
                var interpolate = d3.interpolate(this._current, d)
                this._current = interpolate(0)
                return function (t) {
                  var d2 = interpolate(t)
                  //var pos = outerArc.centroid(d2)
                  var pos = elipsoidCoordination(d2)
                  pos[0] = 0.95 * radius * (midAngle(d2) < Math.PI ? 1 : -1)
                  
                console.log(pos)
                  return 'translate(' + pos + ')'
                }
              })
              .styleTween('text-anchor', function (d) {
                this._current = this._current || d
                var interpolate = d3.interpolate(this._current, d)
                this._current = interpolate(0)
                return function (t) {
                  var d2 = interpolate(t)
                  return midAngle(d2) < Math.PI ? 'start' : 'end'
                }
              })

            text.exit()
              .remove()

            /* ------- SLICE TO TEXT POLYLINES -------*/
            var polyline = svg.select('.lines').selectAll('polyline')
              .data(pie(data), key)
              .attr('class', function(d){
                if(d.data.value == 0 || d.data.isMissing){
                  return 'nodata'
                }
              })

            polyline.enter()
              .append('polyline')

            polyline.transition().duration(1000)
              .attrTween('points', function (d) {
                this._current = this._current || d
                var interpolate = d3.interpolate(this._current, d)
                this._current = interpolate(0)
                return function (t) {
                  var d2 = interpolate(t)
                  //var pos = outerArc.centroid(d2)
                  var pos = elipsoidCoordination(d2)
                  pos[0] = radius * 0.9 * (midAngle(d2) < Math.PI ? 1 : -1)
                  return [arc.centroid(d2), elipsoidCoordination(d2), pos]
                }
              })

            polyline.exit()
              .remove()

            /* ------- Connection lines -------*/
            var data2_pie = pie2(data2)
            var data1_pie = data2_pie.length === 0 ? [] : data

            var connections = svg.select('.connections').selectAll('line')
              .data(pie(data1_pie), key)
            if (data2_pie.length > 0) {
              connections.enter()
                .append('line')

              connections
                .transition().duration(1000)
                .attr('x1', function (d) {
                  return Math.sin(Math.PI - d.startAngle) * radius * 0.45
                })
                .attr('x2', function (d) {
                  var d2 = data2_pie.find(function (d2) { return d2.data.id === d.data.id })
                  return Math.sin(Math.PI - d2.startAngle) * radius2 * 0.65
                })
                .attr('y1', function (d) {
                  return Math.cos(Math.PI - d.startAngle) * radius * 0.45
                })
                .attr('y2', function (d) {
                  var d2 = data2_pie.find(function (d2) { return d2.data.id === d.data.id })
                  return Math.cos(Math.PI - d2.startAngle) * radius2 * 0.65
                })
            }

            connections.exit()
              .remove()
          }

          /*   WATCHERS
          ---------------------------------------------------------------
          */
          scope.$watch('data', function (data) {
            // Options defaults
            var options = {
              stats: [],
              headlines: [],
              units: ''
            }

            // Override defaults
            angular.merge(options, scope.data)
            scope.unit = options.units == null ? '' : options.units[0]
            scope.unit2 = options.units == null ? '' : options.units[1]

            if (options.stats[0] === undefined) return

            scope.render(options.stats[0], options.stats[1] === undefined ? [] : options.stats[1])
          })

          scope.$watch('schemecolors', function (a) {
            // Options defaults
            var options = {
              stats: [],
              headlines: [],
              unit: ''
            }

            // Override defaults
            angular.merge(options, scope.data)

            if (options.stats[0] === undefined) return

            scope.render(options.stats[0], options.stats[1] === undefined ? [] : options.stats[1])
          })
        }
      }
    }
  )
})()
