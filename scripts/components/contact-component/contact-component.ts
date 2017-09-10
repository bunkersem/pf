
export default function contactComponent (angular: any) {
    angular.module('portfolio')
        .component('contact', {
            templateUrl: './scripts/components/contact-component/contact-component.html',
            bindings: {

            },
            controller:['$http', function($http: any) {
                const $ctrl = this;
                $ctrl.$onInit = function() {
                    // Wake up connection.
                    $http.get('https://herokuapp.portfolioapi.com/api');
                }
                $ctrl.send = function() {
                    if ($ctrl.honeycomb !== '') throw Error("Invalid request");
                    $http.post('https://herokuapp.portfolioapi.com/api/contactmail', {
                        name: $ctrl.name,
                        email: $ctrl.email,
                        msg: $ctrl.msg
                    });
                }
            }]
        });
}
