/*globals angular:true*/

;(function () {
  'user strict'

  angular.module('biloAtlas')
    .controller('atlasController', ['$routeParams', 'TopicData', function ($routeParams, topicsService) {
      var atlas = this

      atlas.info = []
      if ($routeParams != undefined && $routeParams.topicid) {
        atlas.info = topicsService.getTopic($routeParams.topicid).data
      } else {
        atlas.info = [
          { id: 22927, name: 'Bamberg', value: 0 },
          { id: 22928, name: 'Bamberg St\u00e4dte', value: 0 },
          { id: 22929, name: 'Bayreuth', value: 0 },
          { id: 22930, name: 'Bayreuth St\u00e4dte', value: 0 },
          { id: 22931, name: 'Coburg', value: 0 },
          { id: 22932, name: 'Coburg St\u00e4dte', value: 0 },
          { id: 22933, name: 'Forchheim', value: 0 },
          { id: 22934, name: 'Hof', value: 0 },
          { id: 22935, name: 'Hof St\u00e4dte', value: 0 },
          { id: 22936, name: 'Kronach', value: 0 },
          { id: 22937, name: 'Kulmbach', value: 0 },
          { id: 22938, name: 'Lichtenfels', value: 0 },
          { id: 22939, name: 'Wunsiedel', value: 0 }
        ]
      }
    }])
    .controller('topicsController', function (TopicData) {
      var c = this
      TopicData.getTopics().then(function (topics) {
        c.topics = topics
      })
    })
    .controller('topicController', function ($routeParams, TopicData) {
      var data = this
      data.selection = 0
      data.sortOrder = '-value'

      TopicData.getTopicById($routeParams.topicid).then(function (topic) {
        data.topic = topic
      })
    })
    .controller('regionController', ['$routeParams', function ($routeParams) {
      var data = this
      data.name = $routeParams.region
      data.region = { name: 'Bamberg', value: 200 }
    }])
})()
