(function () {
    'use strict'

    angular.module('biloAtlas')
       .directive('regionsMap',  function(ColorBrewer, GeoData) {
           return {
               restrict: 'EA',
               scope: {
                   stats: '=',
                   year: '='
               },
               templateUrl: 'app/components/regions-map/regions-map.component.html',
               controller: function($scope){
                   var self = $scope;
                   self.schemecolors = ColorBrewer.colors.PuBu[9];
               },
               link: function (scope, element, attrs) { 
                   var regions;
                   var regionsRendered = false;
                   
                   scope.update = function(data){
                       console.log("updating map");
                       var colors = scope.schemecolors;
                       var regionScale = d3.scale.linear()
                                            .domain([0, scope.maxValue])
                                            .range([0,colors.length-1]);
                                            //.range(ColorBrewer.colors.PuBu[9]);
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
                        
                        //HACK.... Remove entire map, data could also be 
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
                                .append("path")
                                .attr("fill", function (d) { return regionColors(d.value); })
                                .attr("title", function (d) { return GeoData.getRegionData(d.id).properties.NAME_3; })
                                .attr("class", function (d) { return "subunit " + GeoData.getRegionData(d.id).properties.NAME_3.replace(" ", "_"); })
                                .attr("d", function (d) { return pathTopo(GeoData.getRegionData(d.id));})
                                .on("click", clicked)
                                .on("mouseover", function (d) {
                                    lifbi.tooltip.showTooltip(GeoData.getRegionData(d.id).properties.NAME_3 + " " + d.value);
                                    d3.select(this).attr("fill", "#FFFFCC");
                                    scope.active = GeoData.getRegionData(d.id).properties.ID_3;
                                    scope.selection = GeoData.getRegionData(d.id).properties.ID_3;
                                    scope.$apply();
                                })
                                .on("mouseout", function (d) {
                                    lifbi.tooltip.hideTooltip();
                                    d3.select(this).attr("fill", function (d) { return regionColors(d.value) });
                                });
/*
                            d3.json("data/maps/oberfranken_cities.js", function (graph) {
                                locations = svg_topo.selectAll(".locations")
                                    .data(graph.locations)
                                    .enter().append("circle")
                                    .attr("class", "node")
                                    .attr("id", function (d) { return "node_" + d.id; })
                                    .attr("title", function (d) { return d.name; })
                                    .attr("r", function (d) { return d.type == 0 ? 6 : 4 })
                                    .attr("cx", function (d) { return projection_oberfranken([d.lat, d.lon])[0]; })
                                    .attr("cy", function (d) { return projection_oberfranken([d.lat, d.lon])[1]; })
                                    .style("fill", function (d) { return d.type == 0 ? "#fff" : "#f00" })
                                    .style("stroke", "#666");

                                var labelDistance = 10;
                                labels = svg_topo.selectAll(".place-label")
                                    .data(graph.locations).enter().append("text").attr("class", "place-label")
                                    .attr("transform", function (d) { return "translate(" + projection_oberfranken([d.lat, d.lon]) + ")"; })
                                    .attr("dy", ".35em")
                                    .text(function (d) { return d.name; })
                                    .attr("x", function (d) { return d.lat > 10 ? labelDistance : -1 * labelDistance; })
                                    .style("text-anchor", function (d) { return d.lat > 10 ? "start" : "end"; });
                            });*/
                        //});
                    
/*                        function getStat(id) {
                            if(!data) return 0;
                            
                            for (var i = 0; i < data.length; ++i) {
                                if (data[i].id == id ) {
                                    return data[i].value;
                                }
                            }
                            return 0;
                        }*/
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