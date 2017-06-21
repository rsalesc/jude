function maPackageField(Upload) {
    return {
        scope: {
            'field': '&',
            'entry': '&',
            'value': '='
        },
        restrict: 'E',
        link: {
            pre: function (scope) {
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
            post: function (scope, element) {
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

                scope.cancelUpload = function () {
                    try {
                        scope.upload.abort();
                        scope.file.progress = 0;
                        scope.upload = null;
                    } catch (ex) { }
                };

                scope.isUploading = function () {
                    return scope.upload !== null;
                };

                scope.fileSelected = function (selectedFiles) {
                    if (!selectedFiles || selectedFiles.length !== 1) {
                        return;
                    }

                    scope.cancelUpload();

                    let uploadParams = angular.copy(scope.field().uploadInformation());
                    uploadParams.file = selectedFiles[0];
                    uploadParams.url = uploadParams.url.replace(":id", scope.identifier);

                    Upload
                        .upload(uploadParams)
                        .progress(function (evt) {
                            scope.file = {
                                "name": evt.config.file.name,
                                "progress": Math.min(100, parseInt(100.0 * evt.loaded / evt.total))
                            };
                        })
                        .success(function (data, status, headers, config) {
                            scope.upload = null;
                            scope.file = {
                                "name": `Success uploading ${config.file.name}`,
                                "progress": 0
                            };

                            scope.value = data.fid;

                        })
                        .error(function (data, status, headers, config) {
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
};

maPackageField.$inject = ['Upload'];

export default maPackageField;