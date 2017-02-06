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
      min: '<',
      max: '<',
      unit: '<'
    },
    controller: function (ColorBrewer, Colors) {
      this.clickable = true
      //this.colors = ColorBrewer.colors
      this.colors = {
        color1: {
          9: Colors.getPrimary(),
          5: Colors.getPrimary5(),
          3: Colors.getPrimary3()
        },
        color2: {
          9: Colors.getSecondary(),
          5: Colors.getSecondary5(),
          3: Colors.getSecondary3()
        }
      }
      this.opencolors = false

      this.currentMin = 0
      this.currentSchema = []

      /**
       * Adds white color to the schema if the current min value is 0
       * if the min value is not 0 the white color is removed
       */
      this.pickSchema = function(schema){
        if(schema === undefined) return

        this.schema = schema
        this.currentSchema = Object.assign([], schema) //clone data in new array
        
        if(this.currentSchema.indexOf('#FFFFFF') === -1 && this.currentMin+'' === '0'){ 
          this.currentSchema.unshift('#FFFFFF')
        }
        else if(this.currentSchema.indexOf('#FFFFFF') === 0 && this.currentMin+'' !== '0'){
          this.currentSchema.shift()
        }
      }

      this.$onChanges = function(changesObj){
        if(changesObj.min){
          this.currentMin = changesObj.min.currentValue
          this.pickSchema(this.schema)
        }
      }
    }
  })
})()
