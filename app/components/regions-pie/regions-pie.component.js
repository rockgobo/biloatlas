(function () {
    'use strict'

    angular.module('biloAtlas')
       .directive('regionsPie',  function(ColorBrewer) {
           return {
               restrict: 'EA',
               scope: {
                   stats: '=',
                   year: '='
               },
               templateUrl: 'app/components/regions-pie/regions-pie.component.html',
               controller: function($scope){
                   var self = $scope;
                   self.schemecolors = ColorBrewer.colors.PuBu[9];
               },
               link: function (scope, element, attrs) { 
                   
                   
                   scope.render = function(data){ 
                     //d3Service.d3().then(function (d3) {  
                        var colors = scope.schemecolors;
                        var regionScale = d3.scale.linear()
                                            .domain([0, scope.maxValue])
                                            .range([0,colors.length-1]);
                                            //.range(ColorBrewer.colors.PuBu[9]);
                        var regionColors = function(value){
                            if(value == 0) return "#FFF";
                            return colors[Math.floor(regionScale(value))];
                        }         
                        scope.regionColors = ["#FFF"].concat(colors);
                        
                        data = data.map(function(i){ return {label: i.name, value: i.value, color: regionColors(i.value)}});   
                        
                        //update data
                        //if(scope.pie != undefined){
                        //    scope.pie.updateProp("data.content", data);
                        //    return;
                        //}
                       
                                   
                        console.log("starting rendering pie function");
                        
                        /******************************
                         *             D3 TEST
                         *******************************/
                        var width = element[0].clientWidth;
                        var height = 400;

                        //currently selected region
                        var active = d3.select(null);

                        //HACK.... Remove entire map, data could also be 
                        d3.select(element[0]).select("svg").remove();
                        
                        scope.pie = new d3pie("regions-pie", {
                            header: {
                                title: {
                                    text: ""
                                }
                            },
                            data: {
	                           sortOrder: "value-desc",
                               content: data
                            },
                            size: {
                                canvasHeight: 500,
                                canvasWidth: 550,
                                pieInnerRadius: 0,
                                pieOuterRadius: 150
                            },
                            labels: {
                                outer: {
                                    format: "label-value2"
                                },
                                inner: {
                                    format: "none"
                                },
                                mainLabel: {
                                    color: "#333",
                                    font: "arial",
                                    fontSize: 11
                                }
                            },
                            tooltips: {
                                enabled: true,
                                type: "placeholder",
                                string: "{label} {value}"
                            }
                        });


                    //})
                   };
                   
                   scope.$watch('stats', function(data){
                       //Calculate max using all years
                       scope.maxValue = 0;
                       if(data == undefined) {
                           return;
                       }
                       data.forEach( 
                            function (d) { if(d.value > scope.maxValue) scope.maxValue = d.value; }
                       );
                       
                       scope.render(data.filter(function(d){return d.year == scope.year}));
                   })
                   scope.$watch('year', function(year){
                       if(scope.stats == undefined) {
                           return;
                       }
                       scope.render(scope.stats.filter(function(d){return d.year == year}));
                   })
                   
                    scope.$watch('schemecolors', function(year){
                       if(scope.stats == undefined) {
                           return;
                       }
                       scope.render(scope.stats.filter(function(d){return d.year == scope.year}));
                   })
               }
           }
       }
     )
})();