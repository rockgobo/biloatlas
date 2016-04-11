(function(){
    'use strict'
    
    angular.module('biloAtlas')
    .component('topicView', {
        templateUrl: 'app/components/topic-view/topic-view.component.html',
        bindings: {
            topic: '=',
            data: '=?',
            unit: '&',
            average: '&'
        },
        controllerAs: 'topicView',
        controller: function(TopicData){
            this.topic_;
            this.layer = [];
            this.selection = 0;
            this.years = [];
            this.year = false;
            
            this.data_ = []
            this.filterData = function(){
                this.data = this.data_.filter(function(d){
                    return d.year == this.year
                }.bind(this));
            };
                        
            this.$onInit = function(){
                TopicData.getTopicById(this.topic.id).then(function(topic){

                    this.topic_ = topic;
                    if(this.topic_.layers.length > 0){
                        this.selectLayer(this.topic_.layers[0]);
                    }
                    
                }.bind(this))
            }
            
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
                
                this.data_ = layer.data;
                this.filterData();
                
            }
            this.layerVisible = function(id){
                return id == this.layer.id;
            }
            
            this.unit = function(){
                if(this.layer == undefined) return
                return this.layer.unit;
            }
            
            this.average = function(){
                    if(this.data && this.data.length > 0){
                        var data = this.data.map(function (d){return d.value})
                        var sum = data.reduce(function(p, c){return p+c}) 
                        var average = parseFloat((sum / this.data.length)+'').toFixed(2);
                        return average;
                    }
                return 0.0;
            }
            
            this.switchYearLast = function(){
                var index = this.years.indexOf(this.year);
                if(index == 0) return;
                this.year = this.years[index-1];
                this.filterData();
            }
            this.switchYearNext = function(){
                var index = this.years.indexOf(this.year);
                if(index == this.years.length-1) return;
                this.year = this.years[index+1];
                this.filterData();
            }
            this.switchYearLastEnbled = function(){
                return this.years.indexOf(this.year) > 0;;
            }
            this.switchYearNextEnbled = function(){
                return this.years.indexOf(this.year) < this.years.length-1;
            }
            
        }
    })
})()