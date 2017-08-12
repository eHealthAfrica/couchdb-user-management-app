/* global angular */
/* global humane */
/* jshint node: true */
'use strict'

angular.module('app.user')
  .service('alertService', function () {
    this.showMessage = function (message) {
      humane.log(message)
    }

    this.showSuccessMessage = function (message) {
      humane.log(message, { addnCls: 'humane-flatty-success' })
    }

    this.showInfoMessage = function (message) {
      humane.log(message, { addnCls: 'humane-flatty-info' })
    }

    this.showErrorMessage = function (message) {
      humane.log(message, { addnCls: 'humane-flatty-error' })
    }
  })
