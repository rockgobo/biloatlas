/**
 * @author Christian Matyas
 */

;(function () {
  'use strict'

  /**
   * @ng
   * @class biloAtlas.TopicData
   * @memberof biloAtlas
   * @description Service that provides information about topics
   */
/*globals angular:true alert:true*/

  angular.module('biloAtlas')
    .factory('ValuesData', function ($http, ServiceConfig) {
      var webRoot = ServiceConfig.url + 'Values/'


      /**
       * @name getValuesById
       * @function
       * @param {guid} id - The ID of the layer.
       * @return LayerValues object as promise
       */
      function getValuesById (id) {
        return $http.get(webRoot + id).then(
          function (response) {
            return response.data
          },
          function (error) {
            console.log(error)
            return null
          }
        )
      }

      /**
       * @name getTopics
       * @function
       * @return List of topics as promise
       */
      function saveValues (values) {
        if (!values) return

        return $http.post(webRoot, values).then(
          function (response) {
            alert('Daten wurde gespeichert')
            return response.data
          },
          function (error) {
            if (error.status === 500) alert('Es gab leider einen Fehler auf dem Server.')
            if (error.status === 404) alert('Layer wurde auf Server nicht gefunden.')
            console.log(error)
          })
      }

      /**
       * Public API
       */
      return {
        getValuesById: getValuesById,
        saveValues: saveValues
      }
    })
})()
