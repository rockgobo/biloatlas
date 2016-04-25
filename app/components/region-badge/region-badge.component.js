/*global angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('regionBadge', {
      templateUrl: 'app/components/region-badge/region-badge.component.html',
      bindings: {
        regionid: '='
      },
      controllerAs: 'regionBadge',
      controller: function (RegionData, $scope) {
        // initial load
        RegionData.getRegionById(this.regionid).then(function (response) {
          this.region = response.region
        }.bind(this))
    }})
})()
