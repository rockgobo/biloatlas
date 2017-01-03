/**
 * @author Christian Matyas
 */

;(function () {
  'use strict'

  /**
   * @ng
   * @class biloAtlas.Urls
   * @memberof biloAtlas
   * @description Filter to format a number depending on the unit
   */
/*globals angular:true*/
  angular.module('biloAtlas')
    .filter('numberUnit', function($filter) { return function(input, unit) {
        //don´t change missing values
        if(input === '.') return input

        if(unit && unit.trim() === '%'){
            return $filter('number')(input, 1);
        }
        return $filter('number')(input, 0);
    };
})
})()