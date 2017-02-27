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
        this.searchTerm = ''
        this.selectedType = undefined

        this.types = []
        this.parent_types = []

        PoiData.getPoisByRegion(this.regionid).then(function (response) {
          this.pois = response.features
          var types = []
          var parent_types = []

          this.pois.forEach(function (p) {
            var type = p.properties.type
            var parent_type = p.properties.parent_type

            // Get all types
            var test_includes = false
            for (var i = 0; i < types.length; ++i) {
              if (types[i].id === type.id) {
                test_includes = true
                break
              }
            }

            if (!test_includes) {
              type.color = Colors.getPrimarySlices()[type.id]
              type.parent_id = parent_type.id
              types.push(type)
            }

            // Get all parent types
            test_includes = false
            for (var j = 0; j < parent_types.length; ++j) {
              if (parent_types[j].id === parent_type.id) {
                test_includes = true
                break
              }
            }

            if (!test_includes) {
              parent_types.push(parent_type)
            }
          })

          //sort by parent_type.id
          parent_types = parent_types.sort(function(t1,t2) {return t1.id > t2.id})
          // include all type in the parent_types
          parent_types.map(function (parent) {
            parent.children = types.filter(function (t) {
              return t.parent_id === parent.id
            })
            return parent
          })
          this.types = types
          this.parent_types = parent_types
        }.bind(this))

        this.filterPois = function (poi) {
          if (this.searchTerm === '') return true
          return poi.properties.name === this.searchTerm
        }.bind(this)

        this.highlightPoi = function (id) {
          $('.marker_' + id).css('stroke-width', 7)
        }
        this.dehighlightPoi = function (id) {
          $('.marker_' + id).css('stroke-width', 0)
        }
        this.highlightType = function (type) {
          $('.markertype_' + type).css('stroke-width', 7)
        }
        this.dehighlightType = function () {
          $('.marker').css('stroke-width', 0)
        }
      }
    })
})()
