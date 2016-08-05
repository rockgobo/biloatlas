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
    .factory('LayerData', function ($http) {
      // var webRoot = 'http://localhost/dnn7_4/DesktopModules/Bilo.Services.Atlas/API/Layers/'
      var webRoot = 'http://web-dev.neps-data.de/dnn/DesktopModules/Bilo.Services.Atlas/API/Layers/'


      /**
       * @name getTopicById
       * @function
       * @param {guid} id - The ID of the topic.
       * @return Topic object as promise
       */
      function getLayerById (id) {
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
      function getLayers () {
        return $http.get(webRoot).then(
          function (response) {
            return response.data
          },
          function (error) { console.log(error) })
      }

      /**
       * @name getTopics
       * @function
       * @return List of topics as promise
       */
      function saveLayer (layer) {
        if (!layer) return

        return $http.post(webRoot + layer.id, layer).then(
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
        getLayers: getLayers,
        getLayerById: getLayerById,
        saveLayer: saveLayer
      }
    })
})()
