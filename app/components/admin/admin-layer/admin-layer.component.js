/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
  .component('adminLayer', {
    templateUrl: 'app/components/admin/admin-layer/admin-layer.component.html',
    controller: function (TopicData, LayerData, AdminSecurity, $routeParams) {
      
      /* FIELDS*/
      this.message = false
      this.parents = []
      this.selectedParent = { }

      /* LOAD DATA */
      LayerData.getLayerById($routeParams.id).then(function (layer) {
        this.layer = layer
        this.selectedParent = { id: layer.parentId }

        TopicData.getParentLayerById(layer.topicId).then(function (layers) {
          this.parents = layers
        }.bind(this))
      }.bind(this))

      


      /* FUNCTIONS */
      this.save = function () {
        //Set new parentId 
        this.layer.parentId = this.selectedParent.id
        LayerData.saveLayer(this.layer).then(function()
          {
            this.message = 'Layer gespeichert'
          }.bind(this)
        )
      }

      this.delete = function () {
        if(confirm("Wollen sie diesen Layer wirklich löschen?")){
          this.layer.isDeleted = true
          LayerData.saveLayer(this.layer).then(function()
          {
            this.message = 'Layer gelöscht'
          }.bind(this)
        )
        }
      }

      this.undelete = function () {
        this.layer.isDeleted = false
        LayerData.saveLayer(this.layer).then(function()
          {
            this.message = 'Layer wiederhergestellt'
          }.bind(this)
        )
      }

      this.security = AdminSecurity
    }
  })
})()
