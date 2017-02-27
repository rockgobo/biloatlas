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
    function average (data, unit) {
      if(typeof(unit) === undefined) unit = '' // IE compatible default value

      if (data && data.length > 0) {
        var sum = data.reduce(function (p, c) { return p + c })
        var a = (sum / data.length) + ''
        return trim(a, unit)
      }
      return unit.trim() === '%' ? 0.0 : 0
    }

    function trim (value, unit) {
      if(typeof(unit) === undefined) unit = '' // IE compatible default value

      if (unit && unit.trim() === '%') {
        return parseFloat(value).toFixed(1).toLocaleString()
      }
      return parseFloat(value).toFixed(0).toLocaleString()
    }

    function sortRegions(r1, r2){
      var t1 = r1.name
      var t2 = r2.name
      if(t1 === null || t2 === null) return 1

      var prefix1 = t1.slice(0,t1.indexOf(" "))
      var prefix2 = t2.slice(0,t2.indexOf(" "))
      var name1 = r1.shortName
      var name2 = r2.shortName

      if(prefix1 == 'Stadt' && prefix2 == 'Lkr.') return -1
      if(prefix1 == 'Lkr.' && prefix2 == 'Stadt') return 1
      else return name1 > name2 ? 1 : -1
    }
    /**
    * Public API
    */
    return {
      average: average,
      trim: trim,
      sortRegions: sortRegions
    }

    
  }
})()
