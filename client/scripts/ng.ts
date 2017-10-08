import ProjectComponent from './components/project-component/project.component';
import ProjectsListComponent from './components/projects-list-component/projects.list.component';
import ConsoleComponent from './components/console-component/console.component';
import TechstackListComponent from './components/techstack-list-component/techstack.list.component';

import ProjectsService from './services/projects.service';
import TechnologiesService from './services/technologies.service';

const angular = (<any>window).angular;
angular.module('portfolio', ['ngSanitize']);

ProjectsService(angular);
TechnologiesService(angular);

ProjectsListComponent(angular);
ProjectComponent(angular);
ConsoleComponent(angular);
TechstackListComponent(angular);

