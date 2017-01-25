/**
 * Created by CMatyas on 25.01.2017.
 */

/*globals angular:true*/
;(function () {
  'use strict'

  angular.module('biloAtlas')
  .component('adminDashboard', {
    templateUrl: 'app/components/admin/admin-dashboard/admin-dashboard.component.html',
    controller: function (AdminSecurity) {
      this.login = function(password){
          AdminSecurity.register(password)
      }
      this.isValid = function(){
          return AdminSecurity.isValid()
      }
    }
  })
})()
