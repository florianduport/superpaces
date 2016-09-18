var apiBaseUrl = 'http://177.10.0.11:1337';

var superpacesApp = angular.module('superpacesApp', ['ngResource', 'ngSails', 'ngRoute']);

superpacesApp.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = apiBaseUrl;
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
        otherwise('/phones');
    }
  ]);

superpacesApp.controller('global', function($scope){

});


superpacesApp.controller('superpacesHomepageTutor', function ($scope, $sails, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $scope.registerUrl = $sce.trustAsResourceUrl(apiBaseUrl+'/auth/register');
  //$scope.registerUrl = apiBaseUrl+'/auth/register';

  $sails.get("/auth/getUser")
  .success(function (data, status, headers, jwr) {
    $scope.user = data;
  })
  .error(function (data, status, headers, jwr) {
    console.log(data);
  });

  $scope.registerUser = function(firstname, lastname, email, password){
    /*var user = {
      provider: 'local',
      firstname : firstname,
      lastname : lastname,
      name : firstname + ' ' + lastname,
      email : email,
      password : password
    }
    $sails.post("/auth/registerUser", {user : user}).success(function (data, status, headers, jwr) {
      $location.path('/');
    })*/
  };

});

superpacesApp.controller('superpacesTutorLogin', function ($scope, $http, $sails, $location, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
  .success(function (data, status, headers, jwr) {
    $scope.user = data;
    if($scope.user !== undefined && $scope.user.id !== undefined){
      $location.path('/');
    }
  })

  $scope.loginUser = function(username, password){
    /*$http.post($scope.apiBaseUrl+"/auth/local", {username : username, password: password}).then(function (data, status, headers, jwr) {
      console.log(data)
    })*/
  }
});

superpacesApp.controller('superpacesTutorRegister', function ($scope, $sails, $location, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
  .success(function (data, status, headers, jwr) {
    $scope.user = data;
    if($scope.user !== undefined && $scope.user.id !== undefined){

      $location.path('/');
    }
  });
  $scope.registerUser = function(firstname, lastname, email, password){
    /*var user = {
      provider: 'local',
      firstname : firstname,
      lastname : lastname,
      name : firstname + ' ' + lastname,
      email : email,
      password : password
    }
    $sails.post("/auth/registerUser", {user : user}).success(function (data, status, headers, jwr) {
      $location.path('/');
    })*/
  }
});
