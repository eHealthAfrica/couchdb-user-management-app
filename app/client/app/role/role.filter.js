/* global angular */
/* global _ */
/* jshint node: true */
'use strict'

angular.module('app.role')
  .filter('getWithAncestors', function () {
    return function (adminLevels, selectedLevel) {
      if (!adminLevels || !selectedLevel) { return [] }
      var filtered = []
      for (var i in adminLevels) {
        filtered.push(adminLevels[i])
        if (adminLevels[i]._id === selectedLevel) {
          break
        }
      }
      return filtered
    }
  })
  .filter('getChildrenLocation', function () {
    return function (locations, parentLocation, parentLevel) {
      return locations.filter(function (elem) {
        if (!elem.ancestors || elem.ancestors.length !== (parentLevel + 1)) { return false }
        return elem.ancestors.filter(function (ancestorElem) {
          if (ancestorElem._id === parentLocation && ancestorElem.level === parentLevel) { return true }
          return false
        }).length > 0
      })
    }
  })
  .filter('getFacilitiesInLocation', function () {
    return function (facilities, selectedLocations) {
      if (!selectedLocations || selectedLocations.length === 0) { return [] } else {
        var locationId = ('location:' + selectedLocations[(Object.keys(selectedLocations).length - 1).toString()]).replace(/\s/g, '-').toLowerCase()
        return facilities.filter(function (elem) {
          if (!elem.location.ancestors) { return false }
          return elem.location.ancestors.filter(function (ancestorElem) {
            return (ancestorElem._id === locationId && ancestorElem.level === (Object.keys(selectedLocations).length - 1))
          }).length > 0
        })
      }
    }
  })
  .filter('getProgramsInFacility', function () {
    return function (programs, facilityPrograms, facilityId) {
      if (!facilityId || !facilityPrograms) { return [] } else {
        var programsInFacility = facilityPrograms.filter(function (elem) { return elem.facility === facilityId })
        return programs.filter(function (elem) {
          return programsInFacility.filter(function (innerElem) {
            return innerElem.program === elem._id
          }).length > 0
        })
      }
    }
  })
  .filter('getUserType', function () {
    return function (user) {
      if (!user.lomis_stock) { return 'Unassigned' } else {
        if (_.isEmpty(user.lomis_stock.mobile) && _.isEmpty(user.lomis_stock.dashboard)) { return 'None' } else if (_.isEmpty(user.lomis_stock.mobile)) { return 'Dashboard' } else { return 'Mobile' }
      }
    }
  })
