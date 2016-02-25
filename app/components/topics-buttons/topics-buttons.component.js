/**
 * Created by CMatyas on 15.12.2015.
 */
(function(){
    'use strict'

    angular.module('biloAtlas').
        component('topicsButtons',{
        templateUrl: 'app/components/topics-buttons/topics-buttons.component.html',
        controller: function(TopicData,$routeParams){
            this.chunkedTopics = [];
            
            TopicData.getTopics().then(function(topics){
                topics = topics.sort(function(a,b){return a.layers.length < b.layers.length});
                this.chunkedTopics = chunk(topics, 3);
            }.bind(this));
            
            function chunk(arr, size) {
                var newArr = [];
                for (var i=0; i<arr.length; i+=size) {
                    newArr.push(arr.slice(i, i+size));
                }
                return newArr;
            }
        }
    });
})();