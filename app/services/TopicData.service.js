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
    .factory('TopicData', function ($http, $cacheFactory, $q, ServiceConfig) {
      var webRoot = ServiceConfig.url + 'Topics/'
      var cache = $cacheFactory('TopicDataCache'); // Build own cache to remove values in save methods

      function getCachedAsPromise(id){ // encapsulate the cached value in a promise
          return $q(function(resolve, reject) {
            resolve(cache.get(id))
          })
      }

      /**
       * @name getTopicById
       * @function
       * @param {guid} id - The ID of the topic.
       * @return Topic object as promise
       */
      function getTopicById (id) {
        if(cache.get('topic_'+id)){
          return getCachedAsPromise('topics_'+id)
        }

        return $http.get(webRoot + id).then(
          function (response) {
            cache.put('topics_'+id, response.data)
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
        if(cache.get('topics')){
          console.log('get topics from cache')
          return getCachedAsPromise('topics')
        }
        
        return $http.get(webRoot).then(
          function (response) {
            cache.put('topics', response.data)
            return response.data
          },
          function (error) { console.log(error) })
      }

      /**
       * @name getTopics
       * @function
       * @return List of topics as promise
       */
      function saveTopic (topic) {
        if (!topic) return

        return $http.post(webRoot + topic.id, topic).then(
          function (response) {
            cache.remove('topics')
            cache.put('topic_'+topic.id, topic)

            alert('Thema ' + response.data.name + 'gespeichert')
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
        getTopics: getTopics,
        getTopicById: getTopicById,
        saveTopic: saveTopic
      }
    })
})()
