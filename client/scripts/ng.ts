import projectComponent from './components/project-component/project-component';
import projectsListComponent from './components/projects-list-component/projects-list-component';
import contactComponent from './components/contact-component/contact-component';

const angular = (<any>window).angular;
angular.module('portfolio', ['ngSanitize'])
    .service('projectsService', function($http: any) {
        this.getProjects = function () {
            return $http.get('./projects.json');
        }
    });


projectsListComponent(angular);
projectComponent(angular);
contactComponent(angular);