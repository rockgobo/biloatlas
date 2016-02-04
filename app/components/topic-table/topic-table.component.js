(function(){
    'use strict'
    
    angular.module('biloAtlas')
    .component('topicTable', {
        templateUrl: 'app/components/topic-table/topic-table.component.html',
        bindings: {
            id: '@',
            layer: '=',
            year: '='
        },
        controller: function($routeParams,TopicData){
            this.sortOrder = '-value';
            
            this.unit = function(){
                return this.layer.unit;
            }
        }
    })
})()