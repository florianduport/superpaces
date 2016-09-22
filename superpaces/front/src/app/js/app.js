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
        when('/dashboard/create-course', {
          templateUrl: '/js/templates/pages/tutor-dashboard/course.html',
          controller: 'superpacesTutorCreateCourse'
        }).
        when('/dashboard/course/:id', {
          templateUrl: '/js/templates/pages/tutor-dashboard/course.html',
          controller: 'superpacesTutorEditCourse'
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

});

superpacesApp.controller('superpacesTutorCourses', function ($scope, $sails, $location, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
  .success(function (data, status, headers, jwr) {
    $scope.user = data;
    if($scope.user !== undefined && $scope.user.id !== undefined){

      $sails.get("/course?tutor="+$scope.user.id)
      .success(function (data, status, headers, jwr) {
        //console.log(data);

        $scope.courses = data;

      });

    } else {
      $location.path('/');
    }
  });
});

superpacesApp.controller('superpacesTutorEditCourse', function ($scope, $routeParams, $sails, $location, $sce) {

  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
  .success(function (data, status, headers, jwr) {
    $scope.user = data;
    if($scope.user !== undefined && $scope.user.id !== undefined){

      $sails.get("/course?id="+$routeParams.id)
      .success(function (data, status, headers, jwr) {
        //console.log(data);

        $scope.course = data;
        $scope.course.tutor = $scope.user.id;
        if(!$scope.course.category){
          $scope.course.category = "UE1";
        }

        $scope.testQcm = $scope.course.modules[0].questions[0];
        //$scope.title = $scope.course.title;

        $scope.addItem = function(){
          if(!$scope.course.modules){
            $scope.course.modules = [];
          }
          $scope.course.modules.push({
            title : "Titre du module",
            comment : "Commentaire de correction du module",
            questions : []
          });
        };

        $scope.addQuestion = function(item){

          if(!item.questions){
            item.questions = [];
          }
          item.questions.push({
            subject : "Enoncé du QCM",
            comment : "Correction du QCM",
            answers : []
          });
        };

        $scope.addAnswer = function(question){
          console.log(question);
          if(!question.answers){
            question.answers = [];
          }
          question.answers.push({
            subject: "Enoncé de l'item",
            isCorrect: false,
            comment: "Correction de l'item"
          });
        };



      });

    } else {
      $location.path('/');
    }
  });
});

superpacesApp.controller('superpacesTutorCreateCourse', function ($scope, $sails, $location, $sce) {

  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
  .success(function (data, status, headers, jwr) {
    $scope.user = data;
    if($scope.user !== undefined && $scope.user.id !== undefined){

      $scope.course = {
        tutor : $scope.user.id,
        category: "UE1"
      };

      $scope.addItem = function(){
        if(!$scope.course.modules){
          $scope.course.modules = [];
        }
        $scope.course.modules.push({
          title : "Titre du module",
          comment : "Commentaire de correction du module",
          questions : []
        });
      };

      $scope.addQuestion = function(item){

        if(!item.questions){
          item.questions = [];
        }
        item.questions.push({
          subject : "Enoncé du QCM",
          comment : "Correction du QCM",
          answers : []
        });
      };

      $scope.addAnswer = function(question){
        console.log(question);
        if(!question.answers){
          question.answers = [];
        }
        question.answers.push({
          subject: "Enoncé de l'item",
          isCorrect: false,
          comment: "Correction de l'item"
        });
      };


    } else {
      $location.path('/');
    }
  });



});
