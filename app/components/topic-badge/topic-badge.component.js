(function(){
    'use strict'
    
    angular.module('biloAtlas')
    .component('topicBadge', {
        templateUrl: 'app/components/topic-badge/topic-badge.component.html',
        bindings: {
            topic_: '=topic'
        },
        controllerAs: 'topicBadge',
        controller: function(TopicData, $scope){
            //initial load
            TopicData.getTopicById(this.topic_.id).then(function(t){
                this.topic = t;
            }.bind(this))
            
    }})
})()