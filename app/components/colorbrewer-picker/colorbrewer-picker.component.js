/**
 * Created by CMatyas on 15.12.2015.
 */
/* global angular:true */
;(function () {
  'use strict'

  angular.module('biloAtlas').component('colorbrewerPicker', {
    templateUrl: 'app/components/colorbrewer-picker/colorbrewer-picker.component.html',
    bindings: {
      schema: '=',
      min: '=',
      max: '='
    },
    controller: function (ColorBrewer, Colors) {
      this.clickable = false
      // this.colors = ColorBrewer.colors
      this.colors = {
        color1: {
          9: Colors.getPrimary()
        },
        color2: {
          9: Colors.getSecondary()
        }
      }
      this.opencolors = false
    }
  })
})()
