(function(){
    'use strict'

    angular.module('biloAtlas')
    .factory('RegionData', function ($http) {
        var webRoot = "http://localhost/dnn/DesktopModules/Bilo.Services.Atlas/API/Regions/";

        //private implementation
        function getRegionById(id) {
            return $http.get(webRoot+id).then(
                function(response){
                    return response.data;
                },
                function(error) {console.log(error)}
            )
        }

        //returns a promise
        function getRegions() {
            return $http.get(webRoot).then(
                function(response){
                    return response.data;
                },
                function(error) {console.log(error)});
        }
        
        //public API
        return {
            getRegions: getRegions,
            getRegionById: getRegionById
        }
    });

})();