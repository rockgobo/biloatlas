(function(){
    'use strict'
    
    angular.module('biloAtlas')
    .component('topicTable', {
        templateUrl: 'app/components/topic-table/topic-table.component.html',
        bindings: {
            id: '@'
        },
        controller: function(TopicData){
            this.topic = TopicData.getTopicById(this.id);
            this.sortOrder = 'name';
        }
    })
})()