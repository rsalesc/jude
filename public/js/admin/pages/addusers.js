function addUsersController($stateParams, notification, Restangular) {
  this.contestId = $stateParams.contestId;
  this.restangular = Restangular;
  this.notification = notification;
  this.content = { users: []};
  this.dummyField = {
    name() {
      return "dummyField";
    },
    validation() {
      return { required: true };
    },
    attributes() {
      return [];
    }
  };
}

addUsersController.inject = ["$stateParams", "notification", "Restangular"];
addUsersController.prototype.submit = function () {
  this.restangular.one("contests", this.contestId).customPOST(this.content, "addUsers")
    .then(() => this.notification.log(`Users were added.`, { addnCls: "humane-flatty-success" }))
    .catch(e => this.notification.log("A problem occurred, please try again.", { addnCls: "humane-flatty-error" }) && console.error(e));
};

const addUsersTemplate = `
  <div class="row"><div class="col-lg-12">
    <ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>
    <div class="page-header">
      <h1>Add Users to Contest</h1>
    </div>
  </div></div>
  <div class="row">
    <div class="col-lg-5">
      <ma-json-field field="controller.dummyField" value="controller.content"></ma-json-field>  
    </div>
    <div class="col-lg-5">
      <a class="btn btn-default" ng-click="controller.submit()">Submit</a>
    </div>
  </div>
`;
// 
// 

export { addUsersController, addUsersTemplate };
