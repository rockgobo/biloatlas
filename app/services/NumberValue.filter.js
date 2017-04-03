/**
 * @author Christian Matyas
 */

;(function () {
  'use strict'

    /**
     * Filter for values
     * @memberof biloAtlas
     * @description Filter to format a number depending on the unit
     */
    /*globals angular:true*/
    angular.module('biloAtlas')
        .filter('numberValue', function($filter) { return function(value, d) {
            //don´t change missing values
            if(value === '.') return value+' '

            var decimals = 0
            if(d){
                decimals = d
            }
            return $filter('number')(value, decimals)+' '
        };
    })
})()