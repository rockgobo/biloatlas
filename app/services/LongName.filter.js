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
        .filter('longName', function() { return function(input) {
            return input.replace('Lkr.','Landkreis')
        };
    })
})()