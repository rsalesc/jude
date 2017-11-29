// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
const myApp = angular.module("myApp", ["ng-admin"]);

myApp.config((RestangularProvider) => {
  RestangularProvider.setErrorInterceptor((response) => {
    if (response.status === 401 || response.status === 403) {
      window.location.hash = "";
      window.location = "/";
      return false;
    }

    return true;
  });

  RestangularProvider.addFullRequestInterceptor((element, operation, what, url, headers, params, httpConfig) => {
    if (operation == "getList") {
      if (params._sortField) {
        const dir = params._sortDir == "DESC" ? "-" : "";
        params.sort = `${dir}${params._sortField}`;

        delete params._sortField;
        if (params._sortDir)
          delete params._sortDir;
      }

      if (params._filters) {
        params.query = params._filters;
        delete params._filters;
      }

      if (params.query && params.query.q) {
        params.query.$text = { $search: params.query.q };
        delete params.query.q;
      }

      params.skip = (params._page - 1) * params._perPage;
      params.limit = params._perPage;
      delete params._page;
      delete params._perPage;
    }

    return { params };
  });
});

import PackageField from "./directives/package";
import qField from "./helpers/q";
import filteredList from "./helpers/filtered";
import AddUsersAction from "./directives/addusers";
import LogoutHeaderButton from "./directives/logoutHeaderButton";
import { RejudgeListAction, RejudgeBatchAction } from "./directives/rejudge";
import { addUsersController, addUsersTemplate } from "./pages/addusers";

myApp.directive("maPackageField", PackageField);
myApp.directive("maRejudgeAction", RejudgeListAction);
myApp.directive("maRejudgeBatch", RejudgeBatchAction);
myApp.directive("maAddUsers", AddUsersAction);
myApp.directive("maLogoutHeaderButton", LogoutHeaderButton);

myApp.config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state("add-users", {
    parent: "main",
    url: "/addUsers/:contestId",
    template: addUsersTemplate,
    params: { contestId: null },
    controller: addUsersController,
    controllerAs: "controller"
  });
}]);

// Declare a function to run when the
// module bootstraps (during the 'config' phase)
myApp.config(["NgAdminConfigurationProvider", function (nga) {
  // create an admin application
  const admin = nga.application(document.title)
    .baseApiUrl(`${window.location.origin}/api/v1/`);

    /*
        All entities definitions
     */
  const user = nga.entity("users").identifier(nga.field("_id"));
  const contest = nga.entity("contests").identifier(nga.field("_id"));
  const problem = nga.entity("problems").identifier(nga.field("_id"));
  const submission = nga.entity("submissions").identifier(nga.field("_id"));

  /*
        User configuration
     */
  const roles = [
    { label: "Contestant", value: "contestant" },
    { label: "Admin", value: "admin" }
  ];

  const scorings = [
    { label: "ICPC Scoring", value: "IcpcScoring" },
    { label: "Subtask Scoring (add penalties)", value: "SubtaskSumScoring" },
    { label: "Subtask Scoring (max penalties)", value: "SubtaskMaxScoring" },
    { label: "Weighted Scoring", value: "ProductScoring" }
  ];


  user.listView().fields([
    nga.field("_id").label("#").isDetailLink(true).editable(false),
    nga.field("handle")
      .validation({
        required: true,
        pattern: "[a-zA-Z][a-zA-Z0-9_\.]*",
        minlength: 4,
        maxlength: 16
      }),
    nga.field("name")
      .validation({
        minlength: 4,
        maxlength: 48,
        required: true
      }),
    nga.field("role", "choice")
      .choices(roles)
      .validation({ required: true })
  ])
    .filters([
      nga.field("handle"),
      nga.field("contest", "reference")
        .targetEntity(contest)
        .targetField(nga.field("name"))
        .remoteComplete(false),
      qField(nga)
    ]).listActions([
      "edit",
      "delete",
      filteredList("submissions", "{_creator: entry.values.id, contest: entry.values.contest}", "Submissions")
    ]);

  user.showView().fields(user.listView().fields().concat([
    nga.field("unofficial", "boolean").validation({ required: true }),
    nga.field("email", "email"),
    nga.field("contest", "reference")
      .targetEntity(contest)
      .targetField(nga.field("name"))
      .remoteComplete(false)
  ]));

  user.editionView().fields(user.showView().fields(),
                            nga.field("password", "password")
  );
  user.creationView().fields(user.editionView().fields());

  /*
        Contest configuration
     */
  contest.listView().fields([
    nga.field("_id").label("#").isDetailLink(true).editable(false),
    nga.field("name")
      .validation({
        required: true,
        minlength: 4,
        maxlength: 64
      }),
    nga.field("start_time", "datetime"),
    nga.field("end_time", "datetime")
  ]).filters([
    qField(nga)
  ]).listActions([
    filteredList("submissions", "{contest: entry.values.id}", "Submissions"),
    filteredList("users", "{contest: entry.values.id}", "Users"),
    "<ma-add-users size='xs' contest='entry'></ma-add-users>",
    "edit", "delete"
  ]);

  contest.showView().fields(contest.listView().fields().concat([
    nga.field("scoring", "choice")
      .choices(scorings)
      .validation({ required: true }),
    nga.field("hidden", "boolean").validation({ required: true }),
    nga.field("upseeing", "boolean").label("Users can see others codes after the competition")
      .validation({ required: true }),
    nga.field("problems", "embedded_list").defaultValue([])
      .targetFields([
        nga.field("letter")
          .validation({
            required: true,
            pattern: "[A-Z][0-9]*"
          }),
        nga.field("color").validation({ required: true }),
        nga.field("problem", "reference")
          .validation({ required: true })
          .targetEntity(problem)
          .targetField(nga.field("name"))
          .remoteComplete(true, {
            refreshDelay: 300,
            searchQuery: search => ({ q: search })
          })
      ])
  ]));

  contest.editionView().fields(contest.showView().fields());
  contest.creationView().fields(contest.editionView().fields());

  /*
        Problem configuration
     */
  problem.creationView().fields([
    nga.field("code").label("Code").isDetailLink(true)
      .validation({
        required: true,
        minlength: 4,
        maxlength: 24,
        pattern: "[a-zA-Z][a-zA-Z0-9\-]*"
      }),
    nga.field("name")
      .validation({
        required: true,
        minlength: 4,
        maxlength: 64
      })]
  );

  problem.listView().fields([
    nga.field("_id").label("#").editable(false)],
                            problem.creationView().fields(),
                            [nga.field("attr.limits.time").label("Time Limit").editable(false),
                             nga.field("attr.scoring").label("Scoring").editable(false)
                            ]).filters([
    qField(nga)
  ]).listActions([
    "edit",
    "delete",
    filteredList("submissions", "{problem: entry.values.id}", "Submissions")
  ]);

  problem.showView().fields(problem.listView().fields().concat([
    nga.field("attr.limits.memory").label("Memory Limit").editable(false),
    nga.field("statementFid").label("Statement Fid").editable(false)
  ]));

  problem.editionView().fields(problem.showView().fields(),
                               nga.field("fid", "file").label("Package")
                                 .validation({ required: true })
                                 .template("<ma-package-field field='::field' value='entry.values[field.name()]' entry='::entry'></ma-package-field>")
                                 .uploadInformation({ url: `${window.location.origin}/upload/:id` })
  );

  /*
        Submission configuration
     */
  submission.listView().fields([
    nga.field("contest", "reference")
      .targetEntity(contest)
      .targetField(nga.field("name")),
    nga.field("time", "datetime"),
    nga.field("problem", "reference")
      .targetEntity(problem)
      .targetField(nga.field("name")),
    nga.field("_creator", "reference").label("User")
      .targetEntity(user)
      .targetField(nga.field("name"))
  ])
    .listActions([
      "<ma-rejudge-action size='xs' submission='entry'></ma-rejudge-action>",
      "show", "delete"
    ])
    .batchActions([
      "<ma-rejudge-batch selection='selection'></ma-rejudge-batch>",
      "delete"
    ]).filters([
      nga.field("contest", "reference")
        .targetEntity(contest)
        .targetField(nga.field("name")),
      nga.field("problem", "reference")
        .targetEntity(problem)
        .targetField(nga.field("name").map((v, e) => `[${e.code}] ${e.name}`))
        .remoteComplete(true, {
          refreshDelay: 300,
          searchQuery: search => ({ q: search })
        }),
      nga.field("_creator", "reference")
        .targetEntity(user)
        .targetField(nga.field("name").map((v, e) => `[${e.handle}] ${e.name}`))
        .remoteComplete(true, {
          refreshDelay: 300,
          searchQuery: search => ({ q: search })
        })
    ]);

  submission.showView().fields(submission.listView().fields().concat([
    nga.field("code", "text"),
    nga.field("language") // choices actually
    // nga.field('verdict', 'embedded_list')
    //     .targetFields([
    //         nga.field('verdict'),
    //         nga.field('info.text').label("Info"),
    //         nga.field('passed').editable(false)
    //     ])
  ]));

  submission.editionView().fields(submission.showView().fields());
  // submission.creationView().fields(submission.showView().fields());

  // add layout
  admin.header(require("./header.html"));

  // add entities
  admin.addEntity(user);
  admin.addEntity(contest);
  admin.addEntity(problem);
  admin.addEntity(submission);

  nga.configure(admin);
}]);
