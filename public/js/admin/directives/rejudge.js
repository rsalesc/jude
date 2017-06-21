function rejudgeAction(Restangular, $state, notification) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            submission: "&",
            size: "@",
        },
        link: function(scope, element, attrs) {
            scope.submission = scope.submission();
            scope.rejudge = function() {
                Restangular
                    .one('submissions', scope.submission.values.id)
                    .customPOST({}, "rejudge")
                    .then(() => $state.reload())
                    .then(() => notification.log(`Submission ${scope.submission.values.id} was put back on queue`, { addnCls: 'humane-flatty-success' }) )
                    .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) )
            }
        },
        template:
`<a class="btn btn-outline btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="rejudge()">
    Rejudge
</a>`
    };
}

rejudgeAction.$inject = ['Restangular', '$state', 'notification'];

function rejudgeBatch(Restangular, $state, notification) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            selection: "=",
            size: "@",
        },
        link: function(scope, element, attrs) {
            scope.rejudge = function() {
                Promise.all(scope.selection.map(sub => Restangular
                    .one('submissions', sub.values.id)
                    .customPOST({}, "rejudge")))
                    .then(() => $state.reload())
                    .then(() => notification.log(`All ${scope.selection.length} submissions were put back on queue`, { addnCls: 'humane-flatty-success' }) )
                    .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) )
            }
        },
        template:
`<span ng-click="rejudge()">Rejudge</span>`
    };
}

rejudgeBatch.$inject = ['Restangular', '$state', 'notification'];

export { 
    rejudgeAction as RejudgeListAction,
    rejudgeBatch as RejudgeBatchAction
};