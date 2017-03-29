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
    controller: function ($routeParams, $scope, $window, ValuesData, GeoData, AdminSecurity, uiGridValidateService, uiGridConstants) {
      this.sortOrder = 'year'
      this.originalData = []
      this.dataIsValid = true
      this.csvSeperator = ";"
      
      this.regionColName = "region"
      this.yearColName = "year"
      this.valueColName = "value"
      this.layerColName = "layer_id"
      this.filterLayer = true

      var dataTemplate = [
            { region: 24 },
            { region: 22928 },
            { region: 22930 },
            { region: 22932 },
            { region: 22935 },
            { region: 22927 },
            { region: 22929 },
            { region: 22931 },
            { region: 22933 },
            { region: 22934 },
            { region: 22936 },
            { region: 22937 },
            { region: 22938 },
            { region: 22939 }
          ]

      this.reset = function () {    
        $scope.data = angular.copy(this.originalData)
      }
      
      /**
       * VALIDATORS
       */
      //Grid validation - Unique keys
      uiGridValidateService.setValidator('uniqueKeys',
        function(argument) {
          return function(oldValue, newValue, rowEntity, colDef) {
            // assume everything is alright before checking the new data
            this.dataIsValid = true
            
            if (!newValue) {
              return true; // We should not test for existence here
            } else {
              //check if the value only exists once in the data table
              var values = $scope.data.filter(function(d){
                return d.region === rowEntity.region && d.year == rowEntity.year
              })
              if(values.length > 1){
                this.dataIsValid = false
              }

              return values.length === 1
            }
          }.bind(this)
        }.bind(this),
        function(argument) {
          return 'Diese Region/Jahr-Kombination is bereits vergeben'
        }
      )

      //Grid validation - value is a number
      uiGridValidateService.setValidator('valueIsANumber',
        function(argument) {
          return function(oldValue, newValue, rowEntity, colDef) {
            // assume everything is alright before checking the new data
            this.dataIsValid = true
            
            if (!newValue) {
              return true; // We should not test for existence here
            } else {
              //check if the newValue is a valid number
              var er = /^-?[0-9]+(\.[0-9]+)?$/;

              if(!er.test(newValue)){
                this.dataIsValid = false
              }
              return er.test(newValue);
            }
          }.bind(this)
        }.bind(this),
        function(argument) {
          return 'Der Wert muss eine Fließkommazahl sein (Bitte englische Schreibweise mit "." verwenden).'
        }
      )

      $scope.data = []

      //Grid options and data
      this.gridOptions = {
        enableSorting: true,
        enableCellEditOnFocus: true,
        enableGridMenu: true,
        columnDefs: [
          { field: 'region',
            name:'Region', 
            enableCellEditOnFocus: false,
            filter: {
              type: uiGridConstants.filter.SELECT,
              selectOptions: [
                { value: 24, label: 'Oberfranken'  },
                { value: 22928, label: 'Stadt Bamberg' },
                { value: 22930, label: 'Stadt Bayreuth' },
                { value: 22932, label: 'Stadt Coburg' },
                { value: 22935, label: 'Stadt Hof' },
                { value: 22927, label: 'Lkr. Bamberg' },
                { value: 22929, label: 'Lkr. Bayreuth' },
                { value: 22931, label: 'Lkr. Coburg' },
                { value: 22933, label: 'Lkr. Forchheim' },
                { value: 22934, label: 'Lkr. Hof' },
                { value: 22936, label: 'Lkr. Kronach' },
                { value: 22937, label: 'Lkr. Kulmbach' },
                { value: 22938, label: 'Lkr. Lichtenfels' },
                { value: 22939, label: 'Lkr. Wunsiedel i. Fichtelgebirge' }
              ]
            },
            cellFilter: 'mapRegion', 
            editDropdownValueLabel: 'region', 
            editableCellTemplate: 'ui-grid/dropdownEditor', 
            width: '20%',
            validators: {required: true, uniqueKeys: true},
            cellTemplate: 'ui-grid/cellTitleValidator', 
            editDropdownOptionsArray: [
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
          { field: 'year', name:'Jahr', enableCellEdit: true, enableCellEditOnFocus: false, validators: {required: true, uniqueKeys: true}, cellTemplate: 'ui-grid/cellTitleValidator' },
          { field: 'value', name:'Wert', enableCellEdit: true, validators: {required: true, valueIsANumber: true}, cellTemplate: 'ui-grid/cellTitleValidator'}
        ],
        data : 'data',
        enableSelectionBatchEvent: false
      }

    /**
     * this callback is called when the import loaded the CSV data. Data is being passed by newObjects to the callback
     * function. This function filters the data by the layer id and replaces all commas with a point for a javascript 
     * representation of floats.
     */
      this.gridOptions.importerDataAddCallback = function ( grid, newObjects ) { // Add new imported rows to data, filter by layerId if necessary    
        this.msg = ""

        if(this.filterLayer){ // Filter by layer id
          console.log( $routeParams.id )
          newObjects = newObjects.filter(function(d){ return d.layerId.toLowerCase() === $routeParams.id.toLowerCase()})
        }
        // parse value to javascript floats
        var parsedObjects = newObjects.map( function( d ){
          d.value = (d.value+'').replace( ',', '.' )
          return d
        })
        $scope.data = $scope.data.concat( parsedObjects )

        this.msg = parsedObjects.length + " neue Datensätze geladen."
      }.bind(this)

      this.gridOptions.enableFiltering = true
      this.gridOptions.onRegisterApi = function(gridApi){
        //set gridApi on scope
        this.gridApi = gridApi
        this.selectedRows = []
        
        $scope.gridApi = gridApi

        //Set CSV seperator to ;
        CSV.COLUMN_SEPARATOR = this.csvSeperator
        CSV.RELAXED = true

        gridApi.validate.on.validationFailed($scope, function(rowEntity, colDef, newValue, oldValue){
          $scope.dataIsValid = false
        })

        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          
          if(row.isSelected){
            this.selectedRows.push(row)
          }
          else{
            this.selectedRows.splice(this.selectedRows.indexOf(row),1)
          }
        }.bind(this));
        gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
          console.log('batch selection')
        }.bind(this));
      }.bind(this)

      // Find matching columns in the csv file
      this.gridOptions.importerProcessHeaders = function( grid, headerArray ) {
          var myHeaderColumns = [];
          var thisCol;
          console.log(this.regionColName)
          headerArray.forEach( function( value, index ) {
            if(value === this.regionColName){
              myHeaderColumns.push( "region" );
            }
            else if(value === this.yearColName){
              myHeaderColumns.push( "year" );
            }
            else if(value === this.valueColName){
              myHeaderColumns.push( "value" );
            }
            else if(value === this.layerColName){
              myHeaderColumns.push( "layerId" );
            }
            else{
              myHeaderColumns.push(null)
            }
          }.bind(this));

          console.log(myHeaderColumns)
          return myHeaderColumns;

        }.bind(this)


      this.getRegionName = function(id){
        return GeoData.getRegionData(id).properties.NAME_3
      }

      /**
       * TABLE FUNCTIONS
       */
      // Add new year to data
      this.addYear = function(year) {
        var newData = dataTemplate.map(
          function(d){
            d.year = year
            d.value = 0
            return d
        })
        $scope.data = $scope.data.concat(newData)
      }
      // Add new year to data
      this.removeYear = function(year) {
        var newData = $scope.data.filter(
          function(d){
            return d.year+"" !== year+""
        })
        $scope.data = newData
      }
      // Remove selections
      this.removeSelection = function() {
        this.selectedRows.forEach(function(row){
          $scope.data.splice($scope.data.indexOf(row.entity),1)
        })
        this.selectedRows = []
      }
      // Delete value
      this.deleteValue = function(row) {
        console.log('delete')
        $scope.data.splice($scope.data.indexOf(row.entity),1)
        this.selectedRows.splice(this.selectedRows.indexOf(row),1)
      }
      // Remove all
      this.removeAll = function() {
        $scope.data = []
        this.selectedRows = []
      }

      //Load Data
      ValuesData.getValuesById($routeParams.id).then(function (layerValues) {
        layerValues.values.map(function(v){ v.regionName = this.getRegionName(v.region); return v;}.bind(this))
        
        //Register data to Grid UI
        $scope.data = layerValues.values
        this.layerId = layerValues.layerId

        //keep a copy of the original data
        this.originalData = angular.copy(layerValues.values)
      }.bind(this))


      // Save data
      this.save = function () {
        console.log('saving values')
        ValuesData.saveValues({
          layerId: this.layerId,
          values: $scope.data
        })
      }
      this.security = AdminSecurity
    }
  })
})()
