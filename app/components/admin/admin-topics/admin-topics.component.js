/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas').component('adminTopics', {
    templateUrl: 'app/components/admin/admin-topics/admin-topics.component.html',
    controller: function (TopicData, AdminSecurity, $routeParams) {
      TopicData.getTopics().then(function (topics) {
        this.topics = topics
      }.bind(this))

      this.security = AdminSecurity
    }
  })
})()
