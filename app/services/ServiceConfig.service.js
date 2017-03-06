/**
 * @author Christian Matyas
 */

;(function () {
  'use strict'

  /**
   * @ng
   * @class biloAtlas.Urls
   * @memberof biloAtlas
   * @description Service that provides the base URL for webservice
   */
/*globals angular:true*/
  angular.module('biloAtlas')
    .constant('ServiceConfig', 
        {   'url':  //'http://localhost/dnn7_4/DesktopModules/Bilo.Services.Atlas/API/'
                    'http://web-dev.neps-data.de/dnn/DesktopModules/Bilo.Services.Atlas/API/'
        })
})()