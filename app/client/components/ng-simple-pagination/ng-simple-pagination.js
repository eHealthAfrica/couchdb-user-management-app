/* global angular */
'use strict';

angular.module('ng.simple.pagination', []).directive('ngsimplepagination', function(){

  return {

    scope : {

      total: '=',
      pageSize: '=',
      offset: '=',
      onPageRequested: '&'


    },

    link: function(scope, element, attrs){

      scope.currentPage = 0;
      scope.pageCount = 0;
      scope.pageResized =  false;
      scope.pageStart =  0;
      scope.pageEnd = 0;


      scope.$watch('currentPage', function (newVal, oldVal) {
        scope.pageStart = (scope.currentPage * scope.pageSize + 1);
        scope.pageEnd = (scope.currentPage * scope.pageSize ) +  scope.pageSize;


        if (scope.pageStart >  scope.total){ scope.pageStart =  scope.total;}
        if (scope.pageEnd >  scope.total){scope.pageEnd =  scope.total;}


        if (newVal === oldVal) {
          scope.currentPage =  Math.floor( scope.offset / scope.pageSize);
          scope.pageCount =  Math.ceil (scope.total / scope.pageSize);
          if (scope.pageResized){
            scope.pageResized =  false;
            scope.onPageRequested({ limit: scope.pageSize, skip: (newVal * scope.offset)});
          }
        }else {
          scope.onPageRequested({ limit: scope.pageSize, skip: (newVal * scope.pageSize)});
        }
      });

      scope.$watch('total', function (newVal, oldVal) {
        scope.pageCount =  Math.ceil( (scope.total / scope.pageSize) - 1);
      });

      scope.$watch('pageSize', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          scope.currentPage = 0;
        }
      });

      scope.navigateTo = function (page) {
        scope.currentPage = page;
      };



    },

    restrict: 'AEC',
    replace: true,
    templateUrl: 'components/ng-simple-pagination/template.html'


  };


});
