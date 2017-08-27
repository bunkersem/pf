
export function projectComponent (angular: any) {
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
                    console.log($ctrl.project);
                    
                }
                $ctrl.title = 'project';
                $ctrl.keyword = 'lalala, llala, laala',
                $ctrl.isWebApp = true;
                $ctrl.isDesktopApp = true;
                $ctrl.isMobileApp = true;
                $ctrl.isUtil = false;
                $ctrl.content = '<li><b>Hello</b> World this is my content and why does this even matter i dont know.</li>';
            }
        });
}
