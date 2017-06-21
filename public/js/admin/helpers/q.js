export default function(nga, name = "q", placeholder = "Search") {
    return nga.field(name, 'template')
                .label('')
                .pinned(true)
                .template(`<div class="input-group"><input type="text" ng-model="value" placeholder="${placeholder}" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>`);
};