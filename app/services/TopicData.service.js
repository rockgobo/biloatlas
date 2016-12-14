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
/*globals angular:true*/

  angular.module('biloAtlas')
    .factory('TopicData', function ($http, ServiceConfig) {
      var webRoot = ServiceConfig.url + 'Topics/'


      /**
       * @name getTopicById
       * @function
       * @param {guid} id - The ID of the topic.
       * @return Topic object as promise
       */
      function getTopicById (id) {
        return $http.get(webRoot + id, {cache: true}).then(
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
      function getTopics () {
        return $http.get(webRoot, {cache: true}).then(
          function (response) {
            return response.data
          },
          function (error) { console.log(error) })
      }

      /**
       * Public API
       */
      return {
        getTopics: getTopics,
        getTopicById: getTopicById
      }
    })
})()
