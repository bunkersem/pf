import { Project, Technology } from '../../models';

export default function TechStackListComponent(angular: any) {
    angular.module('portfolio')
        .component('techstackList', {
            templateUrl: './scripts/components/techstack-list-component/techstack.list.component.html',
            
            controller: ['technologiesService', function (technologiesService: any) {
                const $ctrl = this;
                technologiesService.getTechnologies().then((response: any) => {
                    console.log('response', response)
                    $ctrl.technologies = <Technology[]>response.data;
                });
                
            }] 
        });
}