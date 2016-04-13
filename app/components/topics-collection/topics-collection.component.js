(function(){
    'use strict'

    angular.module('biloAtlas').
        component('topicsCollection',{
        templateUrl: 'app/components/topics-collection/topics-collection.component.html',
        bindings: {
            data1: '=?',
            data2: '=?'
        },
        controllerAs: 'topicsCollection',
        controller: function(TopicData, ColorBrewer, RegionData, $routeParams){          
            this.topicId1 = {id: $routeParams.topicid};
            this.topicId2 = {id: $routeParams.topicid};
            this.additionLayer = false;
            this.mapOptions = {stats2: { visible: false}}
                        
            this.minValue
            this.maxValue            
            this.colors = ColorBrewer.colors.PuBu[9];
            this.averageColor = '#FFF';
            
            this.visibleMap = true;
            this.visiblePie = false;
            this.visibleTable = false;
            
            this.showMap = function(){
                this.visibleMap = true;
                this.visiblePie = false;
                this.visibleTable = false;
            }
            this.showPie = function(){
                this.visibleMap = false;
                this.visiblePie = true;
                this.visibleTable = false;
            }
            this.showTable = function(){
                this.visibleMap = false;
                this.visiblePie = false;
                this.visibleTable = true;
            }  
            
            this.showAdditionalLayer =function(){
                this.mapOptions.stats2.visible = true;
                this.additionLayer = true;
            }
            this.removeAdditionalLayer =function(){
                this.mapOptions.stats2.visible = false;
                this.additionLayer = false;
            }
                         
            this.average = function(){
                    if(this.data1 && this.data1.length > 0){
                        var data = this.data1.map(function (d){return d.value})
                        var sum = data.reduce(function(p, c){return p+c}) 
                        var average = parseFloat((sum / this.data1.length)+'').toFixed(2);                        
                        
                        this.maxValue = 0;
                        this.minValue = Number.MAX_VALUE;
                        
                        data.forEach(function(d){
                            if(d > this.maxValue) this.maxValue = d; 
                            if(d < this.minValue) this.minValue = d; 
                        }.bind(this));
                        var regionScale = d3.scale.linear()
                                .domain([this.minValue, this.maxValue])
                                .range([0,this.colors.length-1]);
                        
                        if(average == 0) {this.averageColor= "#FFF";}
                        else {this.averageColor = this.colors[Math.floor(regionScale(average))];}
                        
                        return average;
                    }
                return 0;
            };
            
        }
    });
})();