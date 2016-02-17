(function () {
    'user strict';

    /**
    * @namespace biloAtlas    
    */
    angular.module('biloAtlas', ['ngRoute','nvd3']);
    
    //config for cordova app
    /*
        .config(['$compileProvider', function ($compileProvider) {
            //Add ms-appx-web prefix to whitelist otherwise windows 10 add "unsafe:" prefix to links and breaks angularjs links
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|ms-appx-web|x-wmapp0):/);
    }]);*/
})();