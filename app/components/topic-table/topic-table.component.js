(function(){
    'use strict'
    
    angular.module('biloAtlas')
    .component('topicTable', {
        templateUrl: 'app/components/topic-table/topic-table.component.html',
        bindings: {
            id: '@',
            stats: '=',
            unit: '='
        },
        controller: function(){
            this.sortOrder = '-value';
        }
    })
})()