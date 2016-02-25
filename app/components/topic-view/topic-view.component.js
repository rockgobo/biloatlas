(function(){
    'use strict'
    
    angular.module('biloAtlas')
    .component('topicView', {
        templateUrl: 'app/components/topic-view/topic-view.component.html',
        bindings: {
            id: '@'
        },
        controller: function(TopicData,ColorBrewer, $routeParams){
            this.topic;
            this.topicId = $routeParams.topicid
            this.layer = [];
            this.selection = 0;
            this.years = [];
            this.year = false;
            this.visibleMap = true;
            this.visiblePie = false;
            this.visibleTable = false;
            this.colors = ColorBrewer.colors.PuBu[9];
            this.maxValue = 0;
            this.minValue = Number.MAX_VALUE;
            this.regionColors = function(){};
            
            this.data = []
            this.filteredData = []
            this.filterData = function(){
                this.filteredData = this.data.filter(function(d){
                    return d.year == this.year
                }.bind(this));
            };
            
            TopicData.getTopicById(this.topicId).then(function(topic){
                this.topic = topic;
                if(this.topic.layers.length > 0){
                    this.selectLayer(this.topic.layers[0]);
                }
                
            }.bind(this));
            
            this.averageColor = '#00F';
            this.selectLayer = function(layer){
                this.layer = layer;
                this.years = [];
                this.maxValue = 0;
                this.minValue = Number.MAX_VALUE;
                
                layer.data.forEach(function(d){
                    if(this.years.indexOf(d.year) == -1){
                        this.years.push(d.year);
                    }
                    if(d.value > this.maxValue) this.maxValue = d.value; 
                    if(d.value < this.minValue) this.minValue = d.value; 
                }.bind(this));
                               
                this.years.sort();
                this.year = this.years[this.years.length-1];
                
                this.data = layer.data;
                this.filterData();
                
                var regionScale = d3.scale.linear()
                                            .domain([this.minValue, this.maxValue])
                                            .range([0,this.colors.length-1]);
                this.regionColors = function(value){
                    if(value == 0) return "#FFF";
                    return this.colors[Math.floor(regionScale(value))];
                }
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
                        var average = parseFloat((sum / dataOfYear.length)+'').toFixed(2);
                        this.averageColor = this.regionColors(average);
                        return average;
                    }
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
        }
    })
})()