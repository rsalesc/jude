import Papa from 'papaparse';

function correctlyParse(content) {
  try {
    return JSON.parse(content);
  } catch (ex) {
    let parsed = Papa.parse(content, { delimiter: ":", encoding: "utf-8", skipEmptyLines: true });
    if(!parsed.data)
      return { users: [] };

    for(const row of parsed.data) {
      if(row.length != 3) {
        return { users: [] };
      }
    }

    return {
      override: true,
      users: parsed.data.map(x => ({
        handle: x[0],
        password: x[1],
        name: x[2],
        role: "contestant"
      }))
    };
  }
}

function addUsersController($stateParams, notification, Restangular) {
  this.contestId = $stateParams.contestId;
  this.restangular = Restangular;
  this.notification = notification;
  this.content = "";
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
  const parsed = correctlyParse(this.content);
  const len = !parsed.users ? 0 : parsed.users.length;
  this.restangular.one("contests", this.contestId).customPOST(parsed, "addUsers")
    .then(() => this.notification.log(`${len} users were added.`, { addnCls: "humane-flatty-success" }))
    .catch(e => this.notification.log("A problem occurred, please try again.", { addnCls: "humane-flatty-error" }) && console.error(e));
};

const addUsersTemplate = `
  <div class="row"><div class="col-lg-12">
    <div class="page-header">
      <h1>Add Users to Contest</h1>
    </div>
  </div></div>
  <div class="row">
    <div class="col-lg-5">
      <ma-text-field field="controller.dummyField" value="controller.content"></ma-text-field>  
    </div>
    <div class="col-lg-5">
      <a class="btn btn-default" ng-click="controller.submit()">Submit</a>
    </div>
  </div>
`;
// 
// 

export { addUsersController, addUsersTemplate };
