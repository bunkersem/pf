import { Project } from '../../models';

export default function projectsListComponent(angular: any) {
    angular.module('portfolio')
        .component('projectsList', {
            templateUrl: './scripts/components/projects-list-component/projects-list-component.html',
            
            controller: function (projectsService: any) {
                const $ctrl = this;
                $ctrl.filters = {};
                projectsService.getProjects()
                    .then((projects: any) => {
                        $ctrl.projects = projects.data;
                        $ctrl.filteredProjects = $ctrl.projects;
                    });
                $ctrl.isFiltersEmpty = function() {
                    return Object.keys($ctrl.filters).length < 1;
                }
                function escapeRegExp(str: string) {
                    return (str || '').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                }
                function applyFilter() {
                    const searchRegex = new RegExp(escapeRegExp($ctrl.searchStr), 'i');
                    $ctrl.filteredProjects = $ctrl.projects.filter((p: Project) => {
                        return (p.webpApp == ($ctrl.filters['webApp'] || p.webpApp))
                        && (p.mobileApp == ($ctrl.filters['mobileApp'] || p.mobileApp))
                        && (p.desktopApp == ($ctrl.filters['desktopApp'] || p.desktopApp))
                        && (p.util == ($ctrl.filters['util'] || p.util))
                        && searchRegex.test(p.title)
                            // || searchRegex.test(p.keywords.join(' '))
                            // || searchRegex.test(p.content)
                    });
                }
                $ctrl.filter = function(appType: string) {
                    $ctrl.filters[appType] = !$ctrl.filters[appType]
                    applyFilter();
                }
                $ctrl.search = function() {
                    applyFilter();
                }
                $ctrl.removeFilter = function() {
                    $ctrl.filters = {};
                    applyFilter();
                }
            }   
        });
}