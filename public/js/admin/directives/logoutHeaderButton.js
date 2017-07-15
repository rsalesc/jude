import template from "./templates/logoutHeaderButton.html";

export default ["$http", function ($http) {
  return {
    scope: {},
    restrict: "E",
    link(scope, element) {
      scope.logout = async function logout() {
        await $http({ method: "POST", url: "/api-logout" });
        window.location.hash = "";
        window.location = "/";
      };
    },
    template,
    replace: true
  };
}];
