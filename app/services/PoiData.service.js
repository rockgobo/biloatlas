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
    .factory('PoiData', function ($http) {
      // var webRoot = 'http://localhost/dnn7_4/DesktopModules/Bilo.Services.Atlas/API/Poi/Region/'
      var webRoot = 'http://web-dev.neps-data.de/dnn/DesktopModules/Bilo.Services.Atlas/API/Poi/Region/'

      /**
       * @name getRegions
       * @function
       * @return List of regions as promise
       */
      function getPoisByRegion (id) {
        return $http.get(webRoot + id, {cache: true}).then(
          function (response) {
            return response.data
          },
          function (error) { console.log(error) })
      }

      /**
       * Public API
       */
      return {
        getPoisByRegion: getPoisByRegion
      }
    })
})()
