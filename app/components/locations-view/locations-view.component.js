/*global angular:true $*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('locationsView', {
      templateUrl: 'app/components/locations-view/locations-view.component.html',
      binding: {},
      controllerAs: 'locationsView',
      controller: function (RegionData, PoiData, Colors, GeoData, $routeParams) {
        this.topics = []
        this.selection = 0
        this.regionid = $routeParams.id
        this.colorSchema = ['#FFF', Colors.getSecondaryColor()]
        this.searchTerm = ''
        this.selectedType = undefined

        this.types = [{name: 'Grundschulen', color: Colors.getPrimarySlices()[0]},
                      {name: 'Grund- und Mittelschulen', color: Colors.getPrimarySlices()[1]},
                      {name: 'Mittelschulen', color: Colors.getPrimarySlices()[2]},
                      {name: 'Grund- und Hautschulen', color: Colors.getPrimarySlices()[3]},
                      {name: 'Gesamtschulen', color: Colors.getPrimarySlices()[4]},
                      {name: 'Gymnasien', color: Colors.getPrimarySlices()[5]},
                      {name: 'Realschulen', color: Colors.getPrimarySlices()[6]},
                      {name: 'Förderschulen', color: Colors.getPrimarySlices()[7]},
                      {name: 'Waldorfschulen', color: Colors.getPrimarySlices()[8]}]

        PoiData.getPoisByRegion(this.regionid).then(function (response) {
          this.pois = response.features
        }.bind(this))

        this.filterPois = function (poi) {
          if (this.searchTerm === '') return true
          return poi.properties.name === this.searchTerm
        }.bind(this)

        this.highlightPoi = function (id) {
          $('.marker_' + id).css('stroke-width', 2)
        }
        this.dehighlightPoi = function (id) {
          $('.marker_' + id).css('stroke-width', 0)
        }
        this.highlightType = function (type) {
          $('.markertype_' + type).css('stroke-width', 2)
        }
        this.dehighlightType = function () {
          $('.marker').css('stroke-width', 0)
        }
      }
    })
})()
