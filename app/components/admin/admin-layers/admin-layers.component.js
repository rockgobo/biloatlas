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

      this.delete = function(layer){
        

        if(confirm("Wollen sie diesen Layer wirklich löschen?")){
          layer.isDeleted = true
          LayerData.saveLayer(layer)
        }
      }
    }
  })
})()
