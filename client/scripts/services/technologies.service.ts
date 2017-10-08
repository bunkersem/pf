import { Technology } from '../models';

export default function ProjectsService(angular: any) {
    angular.module('portfolio')
        .service('technologiesService', function($http: any) {
            this.getTechnologies = function (): Technology[] {
                return $http.get('./technologies.json');
            }
        });
}