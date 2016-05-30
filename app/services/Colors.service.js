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
        }
      }
    })
})()
