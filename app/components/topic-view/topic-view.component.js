(function(){
    'use strict'
    
    angular.module('biloAtlas')
    .component('topicView', {
        templateUrl: 'app/components/topic-view/topic-view.component.html',
        bindings: {
            id: '@'
        },
        controller: function(TopicData, $routeParams){
            this.topic;
            this.topicId = $routeParams.topicid
            this.layer = [];
            this.selection = 0;
            this.years = [];
            this.year = false;
            this.showMap = true;
            
            TopicData.getTopicById(this.topicId).then(function(topic){
                this.topic = topic;
                if(this.topic.layers.length > 0){
                    this.selectLayer(this.topic.layers[0]);
                }
            }.bind(this));
            
            this.selectLayer = function(layer){
                this.layer = layer;
                this.years = [];
                layer.data.forEach(function(d){
                    if(this.years.indexOf(d.year) == -1){
                        this.years.push(d.year);
                    }
                }.bind(this));
                
                this.years.sort();
                this.year = this.years[this.years.length-1];
            }
            this.layerVisible = function(id){
                return id == this.layer.id;
            }
            
            
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
            
            this.switchYearLast = function(){
                var index = this.years.indexOf(this.year);
                if(index == 0) return;
                this.year = this.years[index-1];
            }
            this.switchYearNext = function(){
                var index = this.years.indexOf(this.year);
                if(index == this.years.length) return;
                this.year = this.years[index+1];
            }
        }
    })
})()