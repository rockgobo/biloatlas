/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
  .component('adminLayer', {
    templateUrl: 'app/components/admin/admin-layer/admin-layer.component.html',
    controller: function (LayerData, AdminSecurity, $routeParams) {
      LayerData.getLayerById($routeParams.id).then(function (layer) {
        this.layer = layer
      }.bind(this))

      this.save = function () {
        LayerData.saveLayer(this.layer)
      }

      this.delete = function () {
        if(confirm("Wollen sie diesen Layer wirklich löschen?")){
          this.layer.isDeleted = true
          LayerData.saveLayer(this.layer)
        }
      }

      this.undelete = function () {
        this.layer.isDeleted = false
        LayerData.saveLayer(this.layer)
      }

      this.security = AdminSecurity
    }
  })
})()
