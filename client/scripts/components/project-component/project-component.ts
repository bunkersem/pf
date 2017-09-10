
export default function projectComponent (angular: any) {
    angular.module('portfolio')
        .component('project', {
            templateUrl: './scripts/components/project-component/project-component.html',
            bindings: {
                project: '<',

            },
            controller: function() {
                const $ctrl = this;
                $ctrl.$onInit = function() {
                    $ctrl.project = $ctrl.project;
                }
            }
        });
}
