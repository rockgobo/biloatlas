/*global angular:true lifbi:true d3:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .directive('regionDetailsMap', function (PoiData, ColorBrewer, GeoData) {
      return {
        restrict: 'EA',
        scope: {
          region: '=',
          options: '='
        },
        templateUrl: 'app/components/region-details-map/region-details-map.component.html',
        link: function (scope, element, attrs) {
          scope.randId = 'details-map-' + new Date().getTime()
          PoiData.getPoisByRegion(scope.region).then(function (response) {
            scope.pois = response.features

            var pathTopo, projection_oberfranken
            var regions

            /*   SETTINGS
            ---------------------------------------------------------------*/
            // Options defaults
            var options = {
              debug: false,
              tooltips: {
                value: true,
                name: true
              }
            }
            // Override defaults
            angular.merge(options, scope.options)

            // utility log function
            function log (m) {
              if (options.debug) console.log(m)
            }

            // scope.render = function (data) {
            log('render map')

            angular.merge(options, scope.options)

            /* *****************************
             *             D3 TEST
             *******************************/
            var width = element[0].clientWidth
            var height = 450

            // Remove entire map, data will be updated later on
            var svg_topo = d3.select('#' + scope.randId).append('svg')
              .attr('width', width)
              .attr('height', height)

            regions = svg_topo.append('g')
              .attr('class', 'black')

            // Filter the intended region from the collection
            var oberfranken = angular.extend({}, GeoData.geoCollection)
            oberfranken.features = oberfranken.features.filter(function (f) {
              return f.properties.ID_3 + '' === scope.region
            })

            var center = d3.geo.centroid(oberfranken)
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
              .data(oberfranken.features)
              .enter()
              .append('path')
              .attr('fill', '#FFF')
              .attr('title', function (d) { return d.properties.NAME_3 })
              .attr('class', function (d) { return 'subunit ' + d.properties.NAME_3.replace(' ', '_') })
              .attr('d', function (d) { return pathTopo(d) })
              .attr('stroke-width', 1)
              .attr('stroke', '#BBB')
              .on('mouseover', function (d) {
                lifbi.tooltip.showTooltip(
                  (options.tooltips.name ? d.properties.NAME_3 + ' ' : ''))
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.hideTooltip()
              })

            regions.selectAll('circle')
              .data(scope.pois)
              .enter()
              .append('circle')
              .attr('fill', '#9B8995')
              .attr('title', function (d) { return d.properties.name })
              .attr('cx', function (d) { return projection_oberfranken(d.geometry.coordinates)[0]})
              .attr('cy', function (d) { return projection_oberfranken(d.geometry.coordinates)[1]})
              .attr('r', 6)
              .attr('stroke-width', 1)
              .attr('stroke', '#666')
              .on('mouseover', function (d) {
                lifbi.tooltip.showTooltip('<div class="poi_info"><b>' + d.properties.name + '</b><br/>' + d.properties.street + ' ' + d.properties.streetNr + '<br/>' + d.properties.city + '</div>')
                d3.select(this).attr('fill', '#980043')
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.hideTooltip()
                d3.select(this).attr('fill', '#9B8995')
              })
          }
          // }
          )

        /*   WATCHERS
        ---------------------------------------------------------------

        scope.$watch('id', function () {
          scope.render()
        })*/
        }
      }
    }
  )
})()
