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
      var colors = ['#111344', '#214E5E', '#5ABA22', '#6D2A6E', '#980043', '#9B8995']
      var minorColors = ['#DDD', '#DDD', '#DDA', '#DCC', '#CCE', '#DDD']

      var p = 2
      var m = 4
      var c = 9

      var slices = tinycolor(colors[m]).analogous(12)
      slices = slices.map(function (t) { return t.toHexString() })

      slices = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']

      return {
        getColors: function (id, count = c) {
          var scale = []

          var grey = tinycolor(minorColors[id])
          var color = tinycolor(colors[id])
          for (var i = 0; i < count; ++i) {
            // color.brighten(60 - (i * 60 / count))

            scale.push(tinycolor.mix(grey, color, i * 100 / count).toHexString())
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
          return colors[p]
        },
        getSecondaryColor: function () {
          return colors[m]
        },
        getPrimarySlices: function () {
          return slices
        }
      }
    })
})()
