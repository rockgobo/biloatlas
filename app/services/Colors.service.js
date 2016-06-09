/**
 * @author Christian Matyas
 */
/*globals angular:true tinycolor:true*/

;(function () {
  'use strict'

  /**
   * @ng
   * @class biloAtlas.RegionData
   * @memberof biloAtlas
   * @description Service that provides information about regions
   */
  angular.module('biloAtlas')
    .factory('Colors', function ($http) {
      var colors = ['#111344', '#214E5E', '#163A00', '#6D2A6E', '#68002E', '#9B8995']
      var minorColors = ['#DDD', '#DDD', '#CEF2B6', '#DCC', '#CCE', '#DDD']
      var cutcolors = ['#DDD', '#DDD', '#5ABA22', '#DCC', '#C6246B', '#DDD']

      var primaryColor = '#5ABA22'
      var secondaryColor = '#980043'

      var p = 2
      var m = 4
      var c = 9

      var slices = tinycolor(colors[m]).analogous(12)
      slices = slices.map(function (t) { return t.toHexString() })

      slices = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928', '#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']

      return {
        getColors: function (id, count) {
          count = typeof count !== 'undefined' ? count : c
          var cut = Math.round(c / 2)
          var scale = []

          var grey = tinycolor(minorColors[id])
          var cutcolor = tinycolor(cutcolors[id])
          var color = tinycolor(colors[id])
          var i = 0
          for (i = 0; i < cut; ++i) {
            scale.push(tinycolor.mix(grey, cutcolor, i * 100 / cut).toHexString())
          }

          for (i; i < count; ++i) {
            scale.push(tinycolor.mix(cutcolor, color, (i - cut) * 100 / (count - cut)).toHexString())
          }
          // scale = tinycolor(this.colors[id]).monochromatic(9).map(function (t) { return t.toHexString() })
          console.log(scale)
          return scale
        },
        getColor: function (id) {
          return colors[(id + 0) % 6]
        },
        getPrimary: function () {
          return this.getColors(p, c)
        },
        getSecondary: function () {
          return this.getColors(m, c)
        },
        getPrimaryColor: function () {
          return primaryColor
        },
        getSecondaryColor: function () {
          return secondaryColor
        },
        getPrimarySlices: function () {
          return slices
        }
      }
    })
})()
