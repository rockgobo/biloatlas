(function () {
    'use strict'

    /**
     * @class biloAtlas.d3Service
     * @memberof biloAtlas
     * @description Service that injects the code of d3 in the document
     */
    angular.module('biloAtlas')
        .factory('d3Service', 
            function($document, $q, $rootScope) {
                //create promise of D3
                var d = $q.defer();

                function onScriptLoad() {
                    $rootScope.$apply(function() { d.resolve(window.d3); });
                }

                //Load D3 into the application
                var scriptTag = $document[0].createElement('script');
                scriptTag.type = 'text/javascript';
                scriptTag.async = true;
                scriptTag.src = 'node_modules/d3/d3.min.js';

                //Load D3.promises into the application
               //var scriptTag2 = $document[0].createElement('script');
                //scriptTag2.type = 'text/javascript';
                //scriptTag2.async = true;
                //scriptTag2.src = 'node_modules/d3.promise/dist/d3.promise.js';

                scriptTag.onreadystatechange = function () {
                    if (this.readyState == 'complete') onScriptLoad();
                };
                scriptTag.onload = onScriptLoad;

                var s = $document[0].getElementsByTagName('body')[0];
                s.appendChild(scriptTag);
                //s.appendChild(scriptTag2);

                // return promise if d3 has loaded
                return {
                    d3: function() { return d.promise; }
                };
            })
})();