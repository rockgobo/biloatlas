/*globals angular:true*/

;(function () {
  'use strict'

  /**
   * @class biloAtlas.AdminSecurity
   * @memberof biloAtlas
   * @description This service provides basic security
   */
  angular
    .module('biloAtlas')
    .factory('AdminSecurity', adminSecurity)

  function adminSecurity ($window) {
    var secret = '8cb579a1c5264b15e3f0d2e1694f45c9'

    function register(token){
        $window.localStorage['adminToken'] = token
    }

    function isValid(){
      if($window.localStorage['adminToken'] === undefined) return false

      var hash = md5.hex($window.localStorage['adminToken'])
      return hash === secret
    }
    /**
    * Public API
    */
    return {
      register: register,
      isValid: isValid
    }

    
  }
})()
