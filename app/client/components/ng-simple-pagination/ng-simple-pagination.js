/* global angular */
'use strict';

angular.module('ng.simple.pagination', []).directive('ngsimplepagination', function () {
  return {
    scope : {
      currentPage: '=',
      total: '=',
      pageSize: '=',
      offset: '=',
      onPageRequested: '&'
    },

    link: function (scope, element, attrs) {
      scope.pageCount = 0;
      scope.pageResized =  false;
      scope.pageStart =  0;
      scope.pageEnd = 0;


      function changePageTo (pageNumber) {
        scope.currentPage =  pageNumber ;

        scope.pageStart = (scope.currentPage * scope.pageSize) + 1;
        scope.pageEnd =  scope.pageStart + scope.pageSize - 1;

        if (scope.pageStart >  scope.total) { scope.pageStart =  scope.total;}
        if (scope.pageEnd > scope.total) {scope.pageEnd =  scope.total;}

        var skip = (pageNumber * scope.pageStart) - 1;
        if (skip < 0) { skip = 0;}

        scope.onPageRequested({limit: scope.pageStart, skip: skip});
      }

      function updatePageCount () {
        scope.pageCount =  Math.ceil(scope.total /  scope.pageSize);
        scope.pageStart = (scope.currentPage * scope.pageSize) + 1;
        scope.pageEnd =  scope.pageStart + scope.pageSize - 1;
        if (scope.pageStart >  scope.total) { scope.pageStart =  scope.total;}
        if (scope.pageEnd > scope.total) {scope.pageEnd =  scope.total;}
      }

      scope.$watch('total', function (newValue, oldValue) {
          updatePageCount();
      });

      scope.$watch('currentPage', function (newVal, oldVal) {
        changePageTo(newVal);
      });

      scope.navigateTo = function (page) {
        changePageTo(page);
      };
    },

    restrict: 'AEC',
    replace: true,
    templateUrl: 'components/ng-simple-pagination/template.html'
  };
});
