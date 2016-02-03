(function(){
    'use strict'

    angular.module('biloAtlas')
    .factory('TopicData', function ($http) {

        // Mock data
        var topics = [];
        topics.push( {
            id: 1,
            name: 'Bildungsstand',
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
            data: [
                { id: 22927, name: 'Bamberg', value: 200 },
                { id: 22928, name: 'Bamberg St\u00e4dte', value: 300 },
                { id: 22929, name: 'Bayreuth', value: 20 },
                { id: 22930, name: 'Bayreuth St\u00e4dte', value: 325 },
                { id: 22931, name: 'Coburg', value: 240 },
                { id: 22932, name: 'Coburg St\u00e4dte', value: 100 },
                { id: 22933, name: 'Forchheim', value: 57 },
                { id: 22934, name: 'Hof', value: 98 },
                { id: 22935, name: 'Hof St\u00e4dte', value: 2 },
                { id: 22936, name: 'Kronach', value: 345 },
                { id: 22937, name: 'Kulmbach', value: 56 },
                { id: 22938, name: 'Lichtenfels', value: 8 },
                { id: 22939, name: 'Wunsiedel', value: 20 }

            ]
        });
        topics.push({
            id: 2,
            name: 'Zufriedenheit',
            description: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            data: [
               { id: 22927, name: 'Bamberg', value: 30 },
               { id: 22928, name: 'Bamberg St\u00e4dte', value: 540 },
               { id: 22929, name: 'Bayreuth', value: 450 },
               { id: 22930, name: 'Bayreuth St\u00e4dte', value: 4 },
               { id: 22931, name: 'Coburg', value: 456 },
               { id: 22932, name: 'Coburg St\u00e4dte', value: 176 },
               { id: 22933, name: 'Forchheim', value: 77 },
               { id: 22934, name: 'Hof', value: 895 },
               { id: 22935, name: 'Hof St\u00e4dte', value: 44 },
               { id: 22936, name: 'Kronach', value: 5 },
               { id: 22937, name: 'Kulmbach', value: 456 },
               { id: 22938, name: 'Lichtenfels', value: 23 },
               { id: 22939, name: 'Wunsiedel', value: 2 }
            ]
        });
        topics.push({
            id: 3,
            name: 'Aufmerksamkeit',
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            data: [
               { id: 22927, name: 'Bamberg', value: 9 },
               { id: 22928, name: 'Bamberg St\u00e4dte', value: 67 },
               { id: 22929, name: 'Bayreuth', value: 976 },
               { id: 22930, name: 'Bayreuth St\u00e4dte', value: 45 },
               { id: 22931, name: 'Coburg', value: 25 },
               { id: 22932, name: 'Coburg St\u00e4dte', value: 456 },
               { id: 22933, name: 'Forchheim', value: 768 },
               { id: 22934, name: 'Hof', value: 6 },
               { id: 22935, name: 'Hof St\u00e4dte', value: 456 },
               { id: 22936, name: 'Kronach', value: 39 },
               { id: 22937, name: 'Kulmbach', value: 1 },
               { id: 22938, name: 'Lichtenfels', value: 324 },
               { id: 22939, name: 'Wunsiedel', value: 144 }
            ]
        });

        var webRoot = "http://localhost/dnn/DesktopModules/Bilo.Services.Atlas/API/Topics/";

        //private implementation
        function getTopicById(id) {
            return $http.get(webRoot+id).then(
                function(response){
                    return response.data;
                },
                function(error) {console.log(error)}
            )
            /*
            var searchTopic = topics.filter(function (topic) { return topic.id == id});
            if (searchTopic.length == 1) {
                return searchTopic[0];
            }
            else {
                return null;
            }*/
        }

        //returns a promise
        function getTopics() {
            return $http.get(webRoot).then(
                function(response){
                    return response.data;
                },
                function(error) {console.log(error)});
        }
        
        //public API
        return {
            getTopics: getTopics,
            getTopicById: getTopicById
        }
    });

})();