/**
 * Created by CMatyas on 15.12.2015.
 */
(function(){
    'use strict'

    angular.module('biloAtlas').
        component('colorbrewerPicker',{
        templateUrl: 'app/components/colorbrewer-picker/colorbrewer-picker.component.html',
        bindings: {
            schema: '=',
            min: '=',
            max: '='
        },
        controller: function(ColorBrewer){
            this.colors = ColorBrewer.colors;
        }
    });
})();