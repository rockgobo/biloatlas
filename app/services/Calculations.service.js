/*globals angular:true*/

;(function () {
  'use strict'

  /**
   * @class biloAtlas.ColorBrewer
   * @memberof biloAtlas
   * @description This service provides the color schemes from https://github.com/mbostock/d3/tree/master/lib/colorbrewer
   */
  angular
    .module('biloAtlas')
    .factory('Calculations', calculations)

  function calculations () {
    function average (data, unit = '') {
      if (data && data.length > 0) {
        var sum = data.reduce(function (p, c) { return p + c })
        var a = (sum / data.length) + ''
        return trim(a, unit)
      }
      return unit.trim() === '%' ? 0.0 : 0
    }

    function trim (value, unit = '') {
      if (unit.trim() === '%') {
        return parseFloat(value).toFixed(1)
      }
      return parseFloat(value).toFixed(0)
    }

    /**
    * Public API
    */
    return {
      average: average,
      trim: trim
    }
  }
})()
