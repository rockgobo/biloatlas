/**
 * Created by CMatyas on 15.12.2015.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
  .filter('mapRegion', function() {
    var regionHash = {
      24: 'Oberfranken',
      22927: 'Lkr. Bamberg',
      22928: 'Stadt Bamberg',
      22929: 'Lkr. Bayreuth',
      22930: 'Stadt Bayreuth',
      22931: 'Lkr. Coburg',
      22932: 'Stadt Coburg',
      22933: 'Lkr. Forchheim',
      22934: 'Lkr. Hof',
      22935: 'Stadt Hof',
      22936: 'Lkr. Kronach',
      22937: 'Lkr. Kulmbach',
      22938: 'Lkr. Lichtenfels',
      22939: 'Lkr. Wunsiedel i. Fichtelgebirge'
    };
  
    return function(input) {
      if (!input){
        return '';
      } else {
        return regionHash[input];
      }
    };
  })
  .component('adminValues', {
    templateUrl: 'app/components/admin/admin-values/admin-values.component.html',
    controller: function ($routeParams, ValuesData, GeoData, AdminSecurity) {
      this.sortOrder = 'year'
      
      //Grid options and data
      this.gridOptions = {
        enableSorting: true,
        columnDefs: [
          { name:'Region', field: 'region',
            cellFilter: 'mapRegion', editDropdownValueLabel: 'region', editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%', editDropdownOptionsArray: [
            { id: 24, region: 'Oberfranken'  },
            { id: 22928, region: 'Stadt Bamberg' },
            { id: 22930, region: 'Stadt Bayreuth' },
            { id: 22932, region: 'Stadt Coburg' },
            { id: 22935, region: 'Stadt Hof' },
            { id: 22927, region: 'Lkr. Bamberg' },
            { id: 22929, region: 'Lkr. Bayreuth' },
            { id: 22931, region: 'Lkr. Coburg' },
            { id: 22933, region: 'Lkr. Forchheim' },
            { id: 22934, region: 'Lkr. Hof' },
            { id: 22936, region: 'Lkr. Kronach' },
            { id: 22937, region: 'Lkr. Kulmbach' },
            { id: 22938, region: 'Lkr. Lichtenfels' },
            { id: 22939, region: 'Lkr. Wunsiedel i. Fichtelgebirge' }
          ]  },
          { name:'Jahr', field: 'year', enableCellEdit: true },
          { name:'Wert', field: 'value', enableCellEdit: true}
        ],
        data : [ ]
      };

      this.getRegionName = function(id){
        return GeoData.getRegionData(id).properties.NAME_3
      }
      //Load Data
      ValuesData.getValuesById($routeParams.id).then(function (layerValues) {
        layerValues.values.map(function(v){ v.regionName = this.getRegionName(v.region); return v;}.bind(this))
        this.gridOptions.data = layerValues.values
        this.layerId = layerValues.Id
      }.bind(this))

      this.save = function () {
        console.log('saving values')
        LayerData.saveLayer({
          id: this.layerId,
          values: this.gridOptions.data
        })
      }


      this.security = AdminSecurity
    }
  })
})()
