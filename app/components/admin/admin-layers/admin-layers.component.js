/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas').component('adminLayers', {
    templateUrl: 'app/components/admin/admin-layers/admin-layers.component.html',
    controller: function (LayerData, AdminSecurity, $routeParams) {
      LayerData.getLayers().then(function (data) {
        this.layerGroups = data
      }.bind(this))

      this.security = AdminSecurity
      this.searchterm = ""

      this.delete = function(layer){
        if(confirm("Wollen sie diesen Layer wirklich löschen?")){
          layer.isDeleted = true
          LayerData.saveLayer(layer)
        }
      }

      this.isVisible = function(layer){
        if(this.searchterm){
          var searchterm = this.searchterm
          return layer.layers.filter( function(l){ return l.name.indexOf(searchterm) > -1 } ).length > 0
        }
        return true
      }
    }
  })
})()
