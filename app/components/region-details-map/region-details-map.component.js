/*global angular:true lifbi:true d3:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .directive('regionDetailsMap', function (PoiData, Colors, ColorBrewer, GeoData) {
      return {
        restrict: 'EA',
        scope: {
          region: '<',
          options: '<',
          pois: '<'
        },
        templateUrl: 'app/components/region-details-map/region-details-map.component.html',
        link: function (scope, element, attrs) {
          scope.randId = 'details-map' // + new Date().getTime()

          var pathTopo, projection_oberfranken
          var regions
          var colors = Colors.getPrimarySlices()

          /*   Icons
          ---------------------------------------------------------------*/
          var icon_size = 12
          var school_path = '<circle cx="12" cy="12" r="8"/>'
          var domain_path = '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>'
          var child_path = '<path d="M6 6h12v12H6z"/>'

          var icons = {
            101: school_path,
            102: domain_path,
            103: child_path
          }
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

          var render = function (pois) {
            var markers = regions.selectAll('g')
              .data(pois, function (p) { return p.properties.id }) // Adding key function to data binding

            markers.enter()
              .append('g')
              .attr('stroke', function (d) { return colors[d.properties.type.id] })
              .attr('stroke-width', 0)
              .attr('transform', function (d) {
                var pixel_coords = projection_oberfranken(d.geometry.coordinates)
                return 'translate(' + (pixel_coords[0].toFixed(4) - (icon_size / 2)) + ',' + (pixel_coords[1].toFixed(4) - (icon_size / 2)) + ') scale(' + (icon_size / 18) + ')'
              })
              .html(function (d) { return icons[d.properties.parent_type.id] })
              .attr('color', function (d) { return colors[d.properties.id] })
              .attr('class', function (d) { return 'marker marker_' + d.properties.id + ' markertype_' + d.properties.type.id })
              .on('mouseover', function (d) {
                lifbi.tooltip.showTooltip('<div class="poi_info"><b>' + d.properties.name + '</b><br/>' + d.properties.street + ' ' + d.properties.streetNr + '<br/>' + d.properties.city + '</div>')
                d3.select(this).attr('color', 'yellow')
              })
              .on('mouseout', function (d) {
                lifbi.tooltip.hideTooltip()
                d3.select(this).attr('color', function (d) { return colors[d.properties.type.id] })
              })
              .attr('fill', function (d) { return colors[d.properties.type.id] })

            markers.transition()
              .duration(500)
              .attr('fill', function (d) { return colors[d.properties.type.id] })

            markers.exit().remove()
          }

          /*   WATCHERS
          ---------------------------------------------------------------
          */
          scope.$watch('pois', function (pois) {
            render(pois === undefined ? [] : pois)
          })
        }
      }
    }
  )
})()
