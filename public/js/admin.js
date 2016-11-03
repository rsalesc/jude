// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var myApp = angular.module('myApp', ['ng-admin']);

/*
    Package field
 */
function maPackageField(Upload){
    return {
        scope: {
            'field': '&',
            'entry': '&',
            'value': '='
        },
        restrict: 'E',
        link: {
            pre: function(scope) {
                var uploadInformation = scope.field().uploadInformation();
                if (!uploadInformation.hasOwnProperty('url')) {
                    throw new Error('You must provide a URL property to allow the upload of files.');
                }

                scope.accept = "*";
                if (uploadInformation.hasOwnProperty('accept')) {
                    scope.accept = uploadInformation.accept;
                }

                scope.file = {
                    progress: 0,
                    name: "No file selected"
                }

                scope.upload = null;
            },
            post: function(scope, element) {
                var field = scope.field();
                scope.name = field.name();
                scope.identifier = scope.entry().identifierValue;

                scope.v = field.validation();
                if (scope.value) {
                    scope.v.required = false;
                }

                var textInput = element.find('input')[0];
                var input = element.find('input')[1];

                var attributes = field.attributes();
                for (var name in attributes) {
                    input.setAttribute(name, attributes[name]);
                }

                scope.cancelUpload = function(){
                    try{
                        scope.upload.abort();
                        scope.file.progress = 0;
                        scope.upload = null;
                    } catch(ex){}
                };

                scope.isUploading = function(){
                    return scope.upload !== null;
                };

                scope.fileSelected = function(selectedFiles) {
                    if (!selectedFiles || selectedFiles.length !== 1) {
                        return;
                    }

                    scope.cancelUpload();

                    let uploadParams = angular.copy(scope.field().uploadInformation());
                    uploadParams.file = selectedFiles[0];
                    uploadParams.url = uploadParams.url.replace(":id", scope.identifier);

                    Upload
                        .upload(uploadParams)
                        .progress(function(evt) {
                            scope.file = {
                                "name": evt.config.file.name,
                                "progress": Math.min(100, parseInt(100.0 * evt.loaded / evt.total))
                            };
                        })
                        .success(function(data, status, headers, config) {
                            scope.upload = null;
                            scope.file = {
                                "name": `Success uploading ${config.file.name}`,
                                "progress": 0
                            };

                            scope.value = data.fid;

                        })
                        .error(function(data, status, headers, config) {
                            scope.upload = null;
                            scope.file = {
                                "name": `Error uploading ${config.file.name}`,
                                "progress": 0
                            };

                            console.log(status, data);
                        });
                };

                scope.selectFile = function () {
                    input.click();
                };
            }
        },
        template:
`<div class="row">
    <div class="col-md-3">
        <input type="text"  ng-model="value" class="form-control text-center" 
         ng-required="v.required" readonly="readonly"/>
    </div>
    <div class="col-md-3"> 
        <a class="btn btn-default" ng-click="selectFile()">
            <span translate="BROWSE"></span>
        </a>
        <button type="button" class="btn btn-danger" ng-click="cancelUpload()" 
            ng-class="{disabled: !isUploading()}">Cancel</button>
    </div>
    <div class="col-md-6">
        <div class="col-md-6" style="padding-top: 6px;">
            <div class="progress" style="margin-bottom: 0;" ng-if="file.progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="{{ file.progress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ file.progress }}%;">
                    <span class="sr-only" translate="N_COMPLETE" translate-values="{ progress: file.progress }"></span>
                </div>
            </div>
        </div>
        <div class="col-md-6" style="padding-top: 6px;"><small><em>{{ file.name }}<em><small></div>
    </div>
</div>

<input type="file" ngf-multiple="multiple" accept="{{ accept }}" ngf-select="fileSelected($files)"
       id="{{ name }}" name="{{ name }}" style="display:none" />`
    };
}

maPackageField.$inject = ['Upload'];
myApp.directive('maPackageField', maPackageField);

// Declare a function to run when the
// module bootstraps (during the 'config' phase)
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application(document.title)
        .baseApiUrl(window.location.origin + "/api/v1/");

    /*
        All entities definitions
     */
    var user = nga.entity('users').identifier(nga.field('_id'));
    var contest = nga.entity('contests').identifier(nga.field('_id'));
    var problem = nga.entity('problems').identifier(nga.field('_id'));
    var submission = nga.entity('submissions').identifier(nga.field('_id'));

    /*
        User configuration
     */
    const roles = [
        {label: "Contestant", value: "contestant"},
        {label: "Admin", value: "admin"}
    ]


    user.listView().fields([
        nga.field('_id').label("#").isDetailLink(true).editable(false),
        nga.field('handle')
            .validation({
                required: true,
                pattern: '[a-zA-Z][a-zA-Z0-9_\.]*',
                minlength: 4,
                maxlength: 16
            }),
        nga.field('name')
            .validation({
                minlength: 4,
                maxlength: 48,
                required: true
            }),
        nga.field('role', 'choice')
            .choices(roles)
            .validation({required: true})
    ]);

    user.showView().fields(user.listView().fields().concat([
            nga.field('unofficial', 'boolean').validation({required: true}),
            nga.field('email', 'email'),
            nga.field('contest', 'reference')
                .targetEntity(contest)
                .targetField(nga.field('name'))
        ]));

    user.editionView().fields(user.showView().fields(),
      nga.field('password', 'password')
    );
    user.creationView().fields(user.editionView().fields());

    /*
        Contest configuration
     */
    contest.listView().fields([
        nga.field('_id').label("#").isDetailLink(true).editable(false),
        nga.field('name')
            .validation({
                required:true,
                minlength: 4,
                maxlength: 64
            }),
        nga.field('start_time', 'datetime'),
        nga.field('end_time', 'datetime')
    ]);

    contest.showView().fields(contest.listView().fields().concat([
        nga.field('scoring'),
        nga.field('hidden', 'boolean').validation({required: true}),
        nga.field('problems', 'embedded_list').defaultValue([])
            .targetFields([
                nga.field('letter')
                    .validation({
                        required: true,
                        pattern: '[A-Z][0-9]*'
                    }),
                nga.field('color'),
                nga.field('problem', 'reference')
                    .validation({required: true})
                    .targetEntity(problem)
                    .targetField(nga.field('name'))
            ]),
    ]));

    contest.editionView().fields(contest.showView().fields());
    contest.creationView().fields(contest.editionView().fields());

    /*
        Problem configuration
     */
    problem.creationView().fields([
        nga.field('code').label("Code").isDetailLink(true)
            .validation({
                required: true,
                minlength: 4,
                maxlength: 24,
                pattern: '[a-zA-Z][a-zA-Z0-9\-]*'
            }),
        nga.field('name')
            .validation({
                required: true,
                minlength: 4,
                maxlength: 64
            })]
    );

    problem.listView().fields([
        nga.field('_id').label("#").editable(false)],
        problem.creationView().fields(),
        [nga.field('attr.limits.time').label("Time Limit").editable(false),
        nga.field('attr.scoring').label("Scoring").editable(false)
    ]);

    problem.showView().fields(problem.listView().fields().concat([
        nga.field('attr.limits.memory').label("Memory Limit").editable(false),
        nga.field('statementFid').label("Statement Fid").editable(false)
    ]));

    problem.editionView().fields(problem.showView().fields(),
        nga.field('fid', 'file').label('Package')
            .validation({required: true})
            .template("<ma-package-field field='::field' value='entry.values[field.name()]' entry='::entry'></ma-package-field>")
            .uploadInformation({url: window.location.origin + "/upload/:id"})
    );

    /*
        Submission configuration
     */
    submission.listView().fields([
        nga.field('_id').label("#").isDetailLink(true).editable(false),
        nga.field('contest', 'reference')
            .targetEntity(contest)
            .targetField(nga.field('name')),
        nga.field('time', 'datetime'),
        nga.field('problem', 'reference')
            .targetEntity(problem)
            .targetField(nga.field('name')),
        nga.field('_creator', 'reference').label("User")
            .targetEntity(user)
            .targetField(nga.field('name'))
    ]);

    submission.showView().fields(submission.listView().fields().concat([
        nga.field('code', 'text'),
        nga.field('language'), // choices actually
        // nga.field('verdict', 'embedded_list')
        //     .targetFields([
        //         nga.field('verdict'),
        //         nga.field('info.text').label("Info"),
        //         nga.field('passed').editable(false)
        //     ])
    ]));

    submission.editionView().fields(submission.showView().fields());
    submission.creationView().fields(submission.showView().fields());

    // add entities
    admin.addEntity(user);
    admin.addEntity(contest);
    admin.addEntity(problem);
    admin.addEntity(submission);

    nga.configure(admin);
}]);