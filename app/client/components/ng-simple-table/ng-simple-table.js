angular.module('ng.simple.table', []).directive('ngsimpletable', function(){

  return {

    scope : {
      allowFilter: '=',
      allowSelect: '=',
      allowSort: '=',
      arrayFields: '=',
      filterFieldClass: '@',
      filterFieldPlaceholder: '@',
      headerClass: '@',
      rowActions: '=',
      rowActionCallback: '&',
      rowActionClass : '@',
      rowActionClasses: '=',
      rowClass: '@',
      rowSelection: '=',
      sortCallback: '&',
      tableClass: '@',
      tableData: '=',
      tableHeader: '=',
      toggleFields: '=',
      toggleFieldCallback: '&',
      unsortableFields: '='
    },

    link: function(scope, element, attrs){

      scope.rowSelection = resetRowSelection();
      scope.searchString = '';
      scope.selectAll = false;
      scope.tableDataCopy = scope.tableData;
      scope.toggleFieldsName =  _.map(scope.toggleFields, 'name');

      scope.$watch('tableData', function(newVal, oldVal){
        scope.rowSelection =  resetRowSelection();
        if (scope.tableData.length > scope.tableDataCopy.length){
          scope.tableDataCopy =  scope.tableData;
        }
      });

      function resetRowSelection () {
        var arr = [];
        for (var i = 0; i < scope.tableData.length; i++){
          arr.push(false);
        }
        return arr;
      }

      function sortList(list, key) {
        function compare(a, b) {
          a = a[key];
          b = b[key];
          var type = (typeof(a) === 'string' || typeof(b) === 'string') ? 'string' : 'number';
          var result;
          if (type === 'string') { result = a.localeCompare(b);}
          else {result = a - b; }
          return result;
        }
        return list.sort(compare);
      }


      scope.filter =  function(){

        scope.tableData =  scope.tableDataCopy;

        if (scope.searchString && scope.searchString.length !== 0){

          scope.tableData =  scope.tableData.filter(function (elem) {
            for( var prop in scope.tableHeader){
              if (elem[scope.tableHeader[prop]].toString().toLowerCase().startsWith(scope.searchString.toLowerCase())){
                return true;
              }
            }
            return false;
          });
        }
        scope.rowSelection = resetRowSelection();
      };

      scope.sort = function (colIndex) {
        if (scope.sortBy && scope.sortBy === scope.tableHeader[colIndex]) {
          if (scope.sortDirection && scope.sortDirection === 'asc') {
            scope.sortDirection = 'desc';
          }
          else {
            scope.sortDirection = 'asc';
          }
        }
        else {
          scope.sortBy = scope.tableHeader[colIndex];
          scope.sortDirection = 'asc';
        }
        scope.sortCallback({by: scope.sortBy, direction: scope.sortDirection});
      };

      scope.toggleSelectAll = function () {
        scope.rowSelection = scope.rowSelection.map(function () {
          return scope.selectAll;
        });
      };
    },

    restrict: 'AEC',
    replace: true,
    templateUrl: 'components/ng-simple-table/template.html'

  };
});
