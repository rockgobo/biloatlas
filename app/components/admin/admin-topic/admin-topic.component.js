/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
  .component('adminTopic', {
    templateUrl: 'app/components/admin/admin-topic/admin-topic.component.html',
    controller: function (TopicData, AdminSecurity, $routeParams) {
      TopicData.getTopicById($routeParams.id).then(function (topic) {
        this.topic = topic
      }.bind(this))

      this.save = function () {
        console.log('saving topic')
        TopicData.saveTopic(this.topic)
      }

      this.security = AdminSecurity
    }
  })
})()
