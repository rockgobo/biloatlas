/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
  .component('adminValues', {
    templateUrl: 'app/components/admin/admin-values/admin-values.component.html',
    controller: function ($routeParams, ValuesData, GeoData, AdminSecurity) {
      this.sortOrder = 'year'
      
      //Load Data
      ValuesData.getValuesById($routeParams.id).then(function (layerValues) {
        this.layerValues = layerValues
      }.bind(this))

      this.save = function () {
        console.log('saving values')
        LayerData.saveLayer(this.layerValues)
      }

      this.getRegionName = function(id){
        return GeoData.getRegionData(id).properties.NAME_3
      }

      this.security = AdminSecurity
    }
  })
})()
