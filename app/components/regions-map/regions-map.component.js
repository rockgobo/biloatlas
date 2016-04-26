/*global angular:true lifbi:true d3:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .directive('regionsMap', function (ColorBrewer, GeoData) {
      return {
        restrict: 'EA',
        scope: {
          stats: '=',
          stats2: '=',
          schemecolors: '=',
          options: '=',
          selection: '=?'
        },
        templateUrl: 'app/components/regions-map/regions-map.component.html',
        link: function (scope, element, attrs) {
          var regions
          var regionsRendered = false
          var regionColors
          var colors = scope.schemecolors
          var pathTopo, projection_oberfranken

          /*   SETTINGS
          ---------------------------------------------------------------*/
          // Options defaults
          var options = {
            debug: false,
            tooltips: {
              value: true,
              name: true
            },
            stats2: {
              visible: false,
              width: 10,
              height: 60,
              label: true
            }
          }
          // Override defaults
          angular.merge(options, scope.options)

          // set some defaults
          if (colors === undefined) {
            colors = ColorBrewer.colors.PuBu[9]
          }

          // utility log function
          function log (m) {
            if (options.debug) console.log(m)
          }

          /**
           * D3 expects updated data in the same sort order as the
           * original data, it also has to be the same length.
           */
          function prepareData2 (data2_ = []) {
            var data2_template = GeoData.getDataByValue(0, 0, data2_.length > 0 ? data2_[0].year : 0)
            return data2_template.map(function (d1) {
              var d2 = data2_.find(function (element) { return element.id === d1.id })
              if (d2) {
                d1.value = d2.value
                d1.name = d2.name
              }
              return d1
            })
          }

          /*   RENDER METHODS
          ---------------------------------------------------------------
          */
          scope.update = function (data, data2_) {
            log('update map')

            // prepare data2
            var data2 = prepareData2(data2_)

            angular.merge(options, scope.options)

            colors = scope.schemecolors
            // set some defaults
            if (colors === undefined) {
              colors = ColorBrewer.colors.PuBu[9]
            }
            var regionScale = d3.scale.linear()
              .domain([scope.minValue, scope.maxValue])
              .range([0, colors.length - 1])
            var regionColors = function (value) {
              if (value === 0) return '#FFF'
              return colors[Math.floor(regionScale(value))]
            }

            regions.selectAll('path')
              .data(data)
              .transition()
              .duration(1000)
              .attr('fill', function (d) { return regionColors(d.value) })

            var max_height = data2.reduce(function (p, c) {
              if (p < c.value) {
                return c.value
              } else {
                return p
              } }, 0)

            regions.selectAll('rect')
              .data(data2)
              .transition()
              .duration(1000)
              .attr('y', function (d) {
                log(d.id + ' ' + d.value + ' ' + max_height)
                if (max_height === 0) return '' // otherwise division by 0
                return projection_oberfranken(GeoData.getCentroid(d.id))[1] - ((d.value / max_height) * options.stats2.height)
              })
              .attr('width', options.stats2.width)
              .attr('height', function (d) {
                if (max_height === 0) return 0 // otherwise division by 0
                return (d.value / max_height) * options.stats2.height
              })
              .style('visibility', options.stats2.visible ? 'visible' : 'hidden')
            regions.selectAll('rect')
              .data(data2).on('mouseover', function (d) {
                lifbi.tooltip.showTooltip(
                (options.tooltips.name ? GeoData.getRegionData(d.id).properties.NAME_3 + ' ' : '') +
                (options.tooltips.value ? d.value : ''))
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.hideTooltip()
              })

            regions.selectAll('line')
              .data(data2)
              .style('visibility', options.stats2.visible ? 'visible' : 'hidden')
            regions.selectAll('g')
              .data(data2)
              .style('visibility', options.stats2.visible ? 'visible' : 'hidden')
            regions.selectAll('g text')
              .data(data2)
              .text(function (d) { return options.stats2.label ? d.value : '' })
          }


          scope.render = function (data, data2_) {
            if (regionsRendered) {
              scope.update(data, data2_)
              return
            }
            log('render map')

            // prepare data2
            var data2 = prepareData2(data2_)

            angular.merge(options, scope.options)

            /* *****************************
             *             D3 TEST
             *******************************/
            var width = element[0].clientWidth
            var height = 400

            // currently selected region
            var active = d3.select(null)

            var regionScale = d3.scale.linear()
              .domain([0, scope.maxValue])
              .range([0, colors.length - 1])
            // .range(ColorBrewer.colors.PuBu[9])
            regionColors = function (value) {
              if (value === 0) return '#FFF'
              return colors[Math.floor(regionScale(value))]
            }
            scope.regionColors = ['#FFF'].concat(colors)

            // Remove entire map, data will be updated later on
            d3.select(element[0]).select('svg').remove()
            var svg_topo = d3.select('#regions-map').append('svg')
              .attr('width', width)
              .attr('height', height)

            regions = svg_topo.append('g')
              .attr('class', 'black')

            var oberfranken

            oberfranken = GeoData.geoCollection
            var center = d3.geo.centroid(GeoData.geoCollection)
            var scale = 150
            var offset = [width / 2, height / 2]

            // projection
            projection_oberfranken = d3.geo.albers()
              .rotate([0, 0])
              .center(center)
              .scale(scale)
              .translate(offset)
            pathTopo = d3.geo.path()
              .projection(projection_oberfranken)

            var bounds = pathTopo.bounds(oberfranken)
            var hscale = 0.6 * scale * width / (bounds[1][0] - bounds[0][0])
            var vscale = 0.6 * scale * height / (bounds[1][1] - bounds[0][1])
            scale = (hscale < vscale) ? hscale : vscale
            offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
              height - (bounds[0][1] + bounds[1][1]) / 2]

            // new projection
            projection_oberfranken = d3.geo.mercator().center(center)
              .scale(scale).translate(offset)
            pathTopo = d3.geo.path()
              .projection(projection_oberfranken)

            regions.selectAll('path')
              .data(data)
              .enter()
              .append('a')
              .attr('xlink:href', function (d) { return '#/region/' + d.id })
              .append('path')
              .attr('fill', function (d) { return regionColors(d.value) })
              .attr('title', function (d) { return GeoData.getRegionData(d.id).properties.NAME_3 })
              .attr('class', function (d) { return 'subunit ' + GeoData.getRegionData(d.id).properties.NAME_3.replace(' ', '_') })
              .attr('d', function (d) { return pathTopo(GeoData.getRegionData(d.id)) })
              .attr('stroke-width', 1)
              .attr('stroke', '#BBB')
              .on('click', clicked)
              .on('mouseover', function (d) {
                lifbi.tooltip.showTooltip(
                  (options.tooltips.name ? GeoData.getRegionData(d.id).properties.NAME_3 + ' ' : '') +
                  (options.tooltips.value ? d.value : ''))
                d3.select(this).attr('stroke', '#666')
                scope.selection = d.id
                scope.$apply() // need to refresh scope manually as data is set in backend code
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.hideTooltip()
                d3.select(this).attr('stroke', '#BBB')
                scope.selection = 0
                scope.$apply() // need to refresh scope manually as data is set in backend code
              })


            var max_height = data2.reduce(function (p, c) {
              if (p < c.value) {
                return c.value
              } else {
                return p
              } }, 0)

            regions.selectAll('rect')
              .data(data2)
              .enter()
              .append('rect')
              .attr('x', function (d) { return projection_oberfranken(GeoData.getCentroid(d.id))[0] - (options.stats2.width / 2) })
              .attr('y', function (d) {
                if (max_height === 0) return '' // otherwise division by 0
                return projection_oberfranken(GeoData.getCentroid(d.id))[1] - ((d.value / max_height) * options.stats2.height) 
              })
              .attr('width', options.stats2.width)
              .attr('height', function (d) {
                if (max_height === 0) return 0 // otherwise division by 0
                return (d.value / max_height) * options.stats2.height
              })
              .attr('fill', '#FFF')
              .attr('stroke', '#666')
              .attr('class', function (d) { return 'id_' + d.id })
              .style('visibility', options.stats2.visible ? 'visible' : 'hidden')
              .on('mouseover', function (d) {
                lifbi.tooltip.showTooltip(
                  (options.tooltips.name ? GeoData.getRegionData(d.id).properties.NAME_3 + ' ' : '') +
                  (options.tooltips.value ? d.value : ''))
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.hideTooltip()
              })
            regions.selectAll('line')
              .data(data2)
              .enter()
              .append('line')
              .attr('class', function (d) { return 'id_' + d.id })
              .attr('x1', function (d) { return projection_oberfranken(GeoData.getCentroid(d.id))[0] - 10 })
              .attr('x2', function (d) { return projection_oberfranken(GeoData.getCentroid(d.id))[0] + 10 })
              .attr('y1', function (d) { return projection_oberfranken(GeoData.getCentroid(d.id))[1] })
              .attr('y2', function (d) { return projection_oberfranken(GeoData.getCentroid(d.id))[1] })
              .attr('stroke', '#666')
              .style('visibility', options.stats2.visible ? 'visible' : 'hidden')
            regions.selectAll('g')
              .data(data2)
              .enter()
              .append('g')
              .attr('class', function (d) { return 'id_' + d.id })
              .attr('transform', function (d) {
                var centroid = projection_oberfranken(GeoData.getCentroid(d.id))
                return 'translate(' + (centroid[0]) + ',' + (centroid[1] + 12) + ')'
              })
              .style('visibility', options.stats2.visible ? 'visible' : 'hidden')
              .append('text')
              .style('text-anchor', 'middle')
              .style('font-size', '10px')
              .text(function (d) { return options.stats2.label ? d.value : '' })


            regionsRendered = true

            // Zoom on click
            /*
            function fitToScreen () {
              var d = oberfranken
              var bounds = pathTopo.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = .9 / Math.max(dx / width, dy / height),
                translatex = width / 2 - scale * x,
                translatey = height / 2 - scale * y,
                translate = [translatex, translatey]
              regions // .transition()
                // .duration(750)
                .style('stroke-width', 1.5 / scale + 'px')
                .attr('transform', 'translate(' + translate + ')scale(' + scale + ')')
              locations // .transition()
                // .duration(750)
                .attr('cx', translatex)
                .attr('cy', translatey)
              labels // .transition()
                // .duration(750)
                .attr('transform', 'translate(' + translate + ')')
            }*/

            // Zoom on click
            function clicked (d) {
              active.classed('active', false)
              active = d3.select(this).classed('active', true)
            }
          }


          /*   WATCHERS
          ---------------------------------------------------------------
          */
          scope.$watch('stats', function (data) {
            // Calculate max using all years
            scope.maxValue = 0
            scope.minValue = Number.MAX_VALUE
            if (data === undefined) {
              return
            }
            data.forEach(
              function (d) { if (d.value > scope.maxValue) scope.maxValue = d.value }
            )
            data.forEach(
              function (d) { if (d.value < scope.minValue) scope.minValue = d.value }
            )

            scope.render(data, scope.stats2)
          })

          scope.$watch('stats2', function (data) {
            if (scope.stats === undefined) {
              return
            }
            scope.render(scope.stats, data)
          })
          scope.$watch('options', function (data) {
            if (scope.stats === undefined) {
              return
            }
            scope.render(scope.stats, scope.stats2)
          }, true)

          scope.$watch('schemecolors', function () {
            if (scope.stats === undefined) {
              return
            }
            scope.render(scope.stats, scope.stats2)
          })
        }
      }
    }
  )
})()
