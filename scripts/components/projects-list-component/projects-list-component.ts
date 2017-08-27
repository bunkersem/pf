import { Project } from '../../models';

export function projectsListComponent(angular: any) {
    angular.module('portfolio')
        .component('projectslist', {
            templateUrl: './scripts/components/projects-list-component/projects-list-component.html',
            
            controller: function (projectsService: any) {
                const $ctrl = this;
                projectsService.getProjects()
                    .then((projects: any) => {
                        console.log(projects.data);
                        $ctrl.projects = projects.data;
                    })
                
            }   
        });
}