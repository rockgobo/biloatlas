(function () {
    'user strict';

    angular.module('biloAtlas')
        
    .directive('biloNavigation', [ function () {
        return {
            restrict: 'EA',
            scope: {
                topics: '='
            },
            templateUrl: 'app/views/directives/biloNavigation.html'
        };
    }])
    .directive('biloTable', [ function () {
        return {
            restrict: 'EA',
            scope: {
                regionInfo: '=stats',
                selection: '=',
                sortOrder: '=' 
            },
            templateUrl: 'app/views/directives/biloTable.html'
        };
    }]);
})();