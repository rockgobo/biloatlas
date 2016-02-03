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
            
            this.average = function(){
                if(this.layer != [] && this.layer.data != undefined){
                    var dataOfYear = this.layer.data.filter(d => d.year == this.year ).map( x => x.value);
                    
                    if(dataOfYear.length > 0){
                        var sum = dataOfYear.reduce((p, c) => p + c) 
                        return parseFloat((sum / dataOfYear.length)+'').toFixed(2);
                    }
                }
                return 0.0;
            }
        }
    })
})()