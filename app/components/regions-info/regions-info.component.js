/*global angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('regionsInfo', {
      templateUrl: 'app/components/regions-info/regions-info.component.html',
      binding: {},
      controllerAs: 'regionsInfo',
      controller: function (GeoData) {
        this.wkts = []
        GeoData.geoCollection.features.forEach(function (feature) {
          this.wkts.push({id: feature.properties.ID_3, wkt: Terraformer.WKT.convert(feature.geometry)})
        }.bind(this))
      }
    })
})()
