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
      var secondaryColor = '#6D2A6E'

      var greens = ['#264d0f', '#326514', '#3d7d18', '#49951c', '#54ae20', '#60c624', '#6cda2d', '#7ddf44', '#8ee35c']
      var purples = ['#110711', '#2b112c', '#451b46', '#602561', '#7a2f7b', '#953897', '#b041b2']
      var blues = ['#091317', '#11272f', '#193b46', '#214e5e', '#296276', '#30768f', '#388aa7']
      var reds = ['#370119', '#570227', '#760235', '#960243', '#b60251', '#d6015f', '#f7016d']

      var p = 2 // primary color index
      var m = 4 // minor color index
      var c = 9 // count of colors for the color schemes

      var slices = []
      var type_colors = [{colors: greens, count: 9}, {colors: purples, count: 2}, {colors: blues, count: 5}]
      type_colors.forEach(function (element) {
        var slice = element.colors.slice((-1) * element.count)
        slices = slices.concat(slice)
      })


      slices = ['#111344', '#214E5E', '#5ABA22', '#6D2A6E', '#980043', '#9B8995']
      var slices_transparent = ['#B8ED9B', '#DDAADE', '#65AFC9', '#FFABD1', '#CFC7CD', '#9498E4']
      slices = slices.concat(slices_transparent).concat(slices).concat(slices_transparent)

      return {
        getColors: function (id, count) {
          count = typeof count !== 'undefined' ? count : c
          var cut = Math.round(count / 2)
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
          return scale
        },

        createColors: function (colorStart, colorEnd, count) {
          if(colorStart === colorEnd) throw "Anfangs und End-Farbwerte dürfen nicht übereinstimmen"

          count = typeof count !== 'undefined' ? count : c
          var cut = Math.round(count / 2)
          var scale = []

          var grey = tinycolor(colorStart)
          var color = tinycolor(colorEnd)

          var i = 0
          for (i = 0; i <  count; ++i) {
            console.log(tinycolor.mix(colorStart, colorEnd, i * 100 / count).toHexString())
            scale.push(tinycolor.mix(colorStart, colorEnd, i * 100 / count).toHexString())
          }

          //check Data for duplicates
          var duplicates = scale.filter(function(elem, pos) { return scale.indexOf(elem) != pos; })
          if(duplicates.length > 0) throw "Farbskala weißt Duplikate auf, bitte wählen sie eine andere Anzahl an Farbwerten oder unterschiedlichere Farbwerte"

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
        getPrimary5: function () {
          return this.getColors(p, 5)
        },
        getSecondary5: function () {
          return this.getColors(m, 5)
        },
        getPrimary3: function () {
          return this.getColors(p, 3)
        },
        getSecondary3: function () {
          return this.getColors(m, 3)
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
