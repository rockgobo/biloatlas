(function () {
    'use strict'

    angular.module('biloAtlas')
       .directive('regionsMap',  function(ColorBrewer, GeoData) {
           return {
               restrict: 'EA',
               scope: {
                   stats: '=',
                   schemecolors: '=',
                   selection: '=?'
               },
               templateUrl: 'app/components/regions-map/regions-map.component.html',
               link: function (scope, element, attrs) { 
                   var regions;
                   var regionsRendered = false;
                   var regionColors;
                   var colors = scope.schemecolors;
                   
                   //set some defaults 
                   if(colors == undefined){
                        colors = ColorBrewer.colors.PuBu[9];
                   }
                   
                   scope.update = function(data){
                       console.log("updating map");
                       colors = scope.schemecolors;
                       //set some defaults 
                       if(colors == undefined){
                            colors = ColorBrewer.colors.PuBu[9];
                       }
                       var regionScale = d3.scale.linear()
                                            .domain([scope.minValue, scope.maxValue])
                                            .range([0,colors.length-1]);
                       var regionColors = function(value){
                            if(value == 0) return "#FFF";
                            return colors[Math.floor(regionScale(value))];
                       } 
                        
                       regions.selectAll("path")
                                .data(data)
                                .transition()
                                .duration(1000)
                                .attr("fill", function (d) { return regionColors(d.value); })
                                
                   }
                    
                   scope.render = function(data){   
                       if(regionsRendered){
                           scope.update(data);
                           return;
                       } 
                       
                                    
                    //d3Service.d3().then(function (d3) {
                        console.log("starting render function");
                        
                        /******************************
                         *             D3 TEST
                         *******************************/
                        var width = element[0].clientWidth;
                        var height = 400;

                        //currently selected region
                        var active = d3.select(null);

                        var projection_oberfranken;
                        var pathTopo;
                        
                        var regionScale = d3.scale.linear()
                                            .domain([0, scope.maxValue])
                                            .range([0,colors.length-1]);
                                            //.range(ColorBrewer.colors.PuBu[9]);
                        regionColors = function(value){
                            if(value == 0) return "#FFF";
                            return colors[Math.floor(regionScale(value))];
                        }         
                        scope.regionColors = ["#FFF"].concat(colors);
                        
                        //Remove entire map, data will be updated later on
                        d3.select(element[0]).select("svg").remove();
                        var svg_topo = d3.select("#regions-map").append("svg")
                            .attr("width", width)
                            .attr("height", height);


                        regions = svg_topo.append("g")
                                .attr("class", "black");

                        var locations,
                            labels,
                            oberfranken;


                        //d3.json("data/maps/oberfranken.js", function (error, d) {
                          //  if (error) return log(error);
                            //oberfranken = d;
                            oberfranken = GeoData.geoCollection;
                            var center = d3.geo.centroid(GeoData.geoCollection);
                            var scale = 150;
                            var offset = [width / 2, height / 2];

                            // projection
                            projection_oberfranken = d3.geo.albers()
                                .rotate([0, 0])
                                .center(center)
                                .scale(scale)
                                .translate(offset);
                            pathTopo = d3.geo.path()
                                    .projection(projection_oberfranken);

                            var bounds = pathTopo.bounds(oberfranken);
                            var hscale = 0.6 * scale * width / (bounds[1][0] - bounds[0][0]);
                            var vscale = 0.6 * scale * height / (bounds[1][1] - bounds[0][1]);
                            scale = (hscale < vscale) ? hscale : vscale;
                            offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                                                height - (bounds[0][1] + bounds[1][1]) / 2];

                            // new projection
                            projection_oberfranken = d3.geo.mercator().center(center)
                                .scale(scale).translate(offset);
                            pathTopo = d3.geo.path()
                                    .projection(projection_oberfranken);

                            regions.selectAll("path")
                                .data(data)
                                .enter()
                                .append("a")
                                .attr("xlink:href", function(d){return "#/region/"+d.id})
                                .append("path")
                                .attr("fill", function (d) { return regionColors(d.value); })
                                .attr("title", function (d) { return GeoData.getRegionData(d.id).properties.NAME_3; })
                                .attr("class", function (d) { return "subunit " + GeoData.getRegionData(d.id).properties.NAME_3.replace(" ", "_"); })
                                .attr("d", function (d) { return pathTopo(GeoData.getRegionData(d.id));})
                                .attr("stroke-width", 1)
                                .attr("stroke", "#BBB")
                                .on("click", clicked)
                                .on("mouseover", function (d) {
                                    lifbi.tooltip.showTooltip(GeoData.getRegionData(d.id).properties.NAME_3 + " " + d.value);
                                    d3.select(this).attr("stroke", "#666");
                                    scope.selection = d.id;
                                    scope.$apply(); //need to refresh scope manually as data is set in backend code
                                })
                                .on("mouseout", function (d) {
                                    lifbi.tooltip.hideTooltip();
                                    d3.select(this).attr("stroke", "#BBB");
                                    scope.selection = 0;
                                    scope.$apply(); //need to refresh scope manually as data is set in backend code
                                });

                        regionsRendered = true;


                        //Zoom on click
                        function fitToScreen() {
                            var d = oberfranken;
                            var bounds = pathTopo.bounds(d),
                                dx = bounds[1][0] - bounds[0][0],
                                dy = bounds[1][1] - bounds[0][1],
                                x = (bounds[0][0] + bounds[1][0]) / 2,
                                y = (bounds[0][1] + bounds[1][1]) / 2,
                                scale = .9 / Math.max(dx / width, dy / height),
                                translatex = width / 2 - scale * x,
                                translatey = height / 2 - scale * y,
                                translate = [translatex, translatey];
                            regions//.transition()
                                //.duration(750)
                                .style("stroke-width", 1.5 / scale + "px")
                                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                            locations//.transition()
                                //.duration(750)
                                .attr("cx", translatex)
                                .attr("cy", translatey);
                            labels//.transition()
                                //.duration(750)
                                .attr("transform", "translate(" + translate + ")");
                        }

                        //Zoom on click
                        function clicked(d) {
                            if (active.node() === this) return fitToScreen();
                            active.classed("active", false);
                            active = d3.select(this).classed("active", true);
                            var bounds = pathTopo.bounds(d),
                                dx = bounds[1][0] - bounds[0][0],
                                dy = bounds[1][1] - bounds[0][1],
                                x = (bounds[0][0] + bounds[1][0]) / 2,
                                y = (bounds[0][1] + bounds[1][1]) / 2,
                                scale = .9 / Math.max(dx / width, dy / height),
                                translate = [width / 2 - scale * x, height / 2 - scale * y],
                                translatex = width / 2 - scale * x,
                                translatey = height / 2 - scale * y;
                            regions.transition()
                                .duration(750)
                                .style("stroke-width", 1.5 / scale + "px")
                                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                            locations.attr("cx", translatex)
                                .attr("cy", translatey);
                        }
                    //}
                    //);
                   }
                   
                   scope.$watch('stats', function(data){
                       //Calculate max using all years
                       scope.maxValue = 0;
                       scope.minValue = Number.MAX_VALUE;
                       if(data == undefined) {
                           return;
                       }
                       data.forEach( 
                            function (d) { if(d.value > scope.maxValue) scope.maxValue = d.value; }
                       );
                       data.forEach( 
                            function (d) { if(d.value < scope.minValue) scope.minValue = d.value; }
                       );
                                              
                       scope.render(data);
                   })
                   
                    scope.$watch('schemecolors', function(){
                       if(scope.stats == undefined) {
                           return;
                       }
                       scope.render(scope.stats);
                   })
               }
           }
       }
     )
})();