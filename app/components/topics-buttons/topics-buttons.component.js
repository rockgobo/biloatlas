/**
 * Created by CMatyas on 15.12.2015.
 */
(function(){
    'use strict'

    angular.module('biloAtlas').
        component('topicsButtons',{
        templateUrl: 'app/components/topics-buttons/topics-buttons.component.html',
        controller: function(TopicData,$routeParams){
            this.topics = [];
            TopicData.getTopics().then(function(topics){
                this.topics = topics;
            }.bind(this));
        }
    });
})();