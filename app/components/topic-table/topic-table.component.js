/*globals angular:true $:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('topicTable', {
      templateUrl: 'app/components/topic-table/topic-table.component.html',
      bindings: {
        id: '@',
        data: '='
      },
      controllerAs: 'topicTable',
      controller: function ($scope, Calculations) {
        this.sortOrder = 'id'
        this.stats = []

        /*   SETTINGS
          ---------------------------------------------------------------*/
        // Options defaults
        var options = {
          stats: [],
          headlines: [],
          units: []
        }
        // Override defaults
        angular.merge(options, this.data)

        // Watch topic
        $scope.$watch('topicTable.data', function (data) {
          angular.merge(options, data)
          this.units = options.units

          var stats = {}
          var columns = 0
          data.stats.forEach(function (s) {
            if (s.length === 0) return

            s.forEach(function (stat) {
              var value = stat.value
              value =  Calculations.trim (value, options.units[columns])
                
              if (stats[stat.id] === undefined) {
                stats[stat.id] = {id: stat.id, name: stat.name, data: [value]}
              } else {
                stats[stat.id].data.push(value)
              }
            })

            columns += 1
          })
          var array = []
          $.each(stats, function (s, n) {
            array.push(n)
          })

          // fill headlines with blanks
          var headlines = []
          for (var i = 0; i < columns; ++i) {
            headlines.push(options.headlines[i] === undefined ? '&nbsp;' : options.headlines[i])
          }
          this.headlines = headlines
          this.stats = array.sort(Calculations.sortRegions)
        }.bind(this))
      }
    })
})()
