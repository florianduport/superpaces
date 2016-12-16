io.sails.url = "http://177.10.0.11:1337";
var superpacesApp = angular.module('superpacesApp',

    ['ngResource', 'ngSails', 'ngRoute',
        'TutorCtrl', 'CourseCtrl', 'Resources'
    ]);

superpacesApp.config(['$sailsProvider', 'RESOURCES', function($sailsProvider, RESOURCES) {
    io.sails.url = "http://177.10.0.11:1337";
    $sailsProvider.url = RESOURCES.CONFIG.BASEAPIURL;
}]);

superpacesApp.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/', {
            templateUrl: '/js/templates/pages/homepage-tutor.html',
            controller: 'superpacesHomepageTutor'
        }).
        when('/tutor-login', {
            templateUrl: '/js/templates/pages/tutor-login.html',
            controller: 'superpacesTutorLogin'
        }).
        when('/tutor-register', {
            templateUrl: '/js/templates/pages/tutor-register.html',
            controller: 'superpacesTutorRegister'
        }).
        when('/dashboard/create-course', {
            templateUrl: '/js/templates/pages/tutor-dashboard/course.html',
            controller: 'superpacesTutorCreateCourse',
        }).
        when('/dashboard/course/:id', {
            templateUrl: '/js/templates/pages/tutor-dashboard/course.html',
            controller: 'superpacesTutorCreateCourse'
        }).
        when('/dashboard/', {
            templateUrl: '/js/templates/pages/tutor-dashboard/courses.html',
            controller: 'superpacesTutorCourses'
        }).
        otherwise('/404', {
            templateUrl: '/js/templates/pages/404.html',
            controller: 'superpacesHomepageTutor'
        });
    }
]);

superpacesApp.controller('global', function($scope) {

});
