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
        }
    })
})()