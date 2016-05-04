/**
 * @author Christian Matyas
 */
/*globals angular:true*/

;(function () {
  'use strict'

  /**
   * @ng
   * @class biloAtlas.RegionData
   * @memberof biloAtlas
   * @description Service that provides information about regions
   */
  angular.module('biloAtlas')
    .factory('RegionData', function ($http) {
      var colors = {
          
      }

      function getColor (id) {
      }

      return {
        getColor: getColor
      }
    })
})()
