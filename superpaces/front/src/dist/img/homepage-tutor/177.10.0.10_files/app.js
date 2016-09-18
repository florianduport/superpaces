var superpacesApp = angular.module('superpacesApp', ['ngResource', 'ngSails', 'ngRoute']);

superpacesApp.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = 'http://177.10.0.11:1337';
}]);

superpacesApp.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          templateUrl: '/js/templates/pages/homepage-tutor.html',
          controller: 'superpacesHomepageTutor'
        }).
        otherwise('/phones');
    }
  ]);

superpacesApp.controller('global', function($scope){

});

superpacesApp.controller('superpacesHomepageTutor', function ($scope, $sails) {

  /*$sails.get("/catalog")
  .success(function (data, status, headers, jwr) {

    $scope.catalogs = data;

    for (var i = 0; i < $scope.catalogs.length; i++) {
      $scope.catalogs[i].validity.begin = new Date($scope.catalogs[i].validity.begin).toLocaleDateString();
      $scope.catalogs[i].validity.end = new Date($scope.catalogs[i].validity.end).toLocaleDateString();
    }

  })
  .error(function (data, status, headers, jwr) {
    console.log(data);
  });*/

});
