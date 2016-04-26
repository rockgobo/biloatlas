/*globals angular:true*/

;(function () {
  'use strict'

  angular.module('biloAtlas')
    .component('topicTable', {
      templateUrl: 'app/components/topic-table/topic-table.component.html',
      bindings: {
        id: '@',
        stats: '=',
        stats2: '=',
        unit: '='
      },
      controller: function ($scope) {
        this.sortOrder = 'name'

        // Watch topic
        $scope.$watch('$ctrl.stats2', function (stats2) {
          if (stats2 === undefined) return
          this.stats.map(function (stat) {
            for (var i = 0; i < stats2.length; ++i) {
              if (stat.id === stats2[i].id) {
                stat.value2 = stats2[i].value
                return stat
              }
            }
          })
        }.bind(this))
      }
    })
})()
