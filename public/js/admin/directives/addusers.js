export default ["$location", function ($location) {
  return {
    restrict: "E",
    scope: { contest: "&" },
    link(scope) {
      scope.add = function () {
        $location.path(`/addUsers/${scope.contest().values.id}`);
      };
    },
    template: '<a class="btn btn-default" ng-click="add()">Add Users</a>'
  };
}];
