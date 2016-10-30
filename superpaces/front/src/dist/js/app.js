var apiBaseUrl = 'http://177.10.0.11:1337';

var superpacesApp = angular.module('superpacesApp', ['ngResource', 'ngSails', 'ngRoute']);

superpacesApp.config(['$sailsProvider', function($sailsProvider) {
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

superpacesApp.controller('global', function($scope) {

});

superpacesApp.controller('superpacesHomepageTutor', function($scope, $sails, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $scope.registerUrl = $sce.trustAsResourceUrl(apiBaseUrl + '/auth/register');
  //$scope.registerUrl = apiBaseUrl+'/auth/register';

  $sails.get("/auth/getUser")
    .success(function(data, status, headers, jwr) {
      $scope.user = data;
    })
    .error(function(data, status, headers, jwr) {
      console.log(data);
    });

});

superpacesApp.controller('superpacesTutorLogin', function($scope, $http, $sails, $location, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
    .success(function(data, status, headers, jwr) {
      $scope.user = data;
      if ($scope.user !== undefined && $scope.user.id !== undefined) {
        $location.path('/');
      }
    })
});

superpacesApp.controller('superpacesTutorRegister', function($scope, $sails, $location, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
    .success(function(data, status, headers, jwr) {
      $scope.user = data;
      if ($scope.user !== undefined && $scope.user.id !== undefined) {

        $location.path('/');
      }
    });

});

superpacesApp.controller('superpacesTutorCourses', function($scope, $sails, $location, $sce) {
  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
    .success(function(data, status, headers, jwr) {
      $scope.user = data;
      if ($scope.user !== undefined && $scope.user.id !== undefined) {

        $sails.get("/course?tutor=" + $scope.user.id)
          .success(function(data, status, headers, jwr) {
            //console.log(data);

            $scope.courses = data;

          });

      } else {
        $location.path('/');
      }
    });
});

superpacesApp.controller('superpacesTutorEditCourse', function($scope, $routeParams, $sails, $location, $sce) {

  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
    .success(function(data, status, headers, jwr) {
      $scope.user = data;
      if ($scope.user !== undefined && $scope.user.id !== undefined) {

        $sails.get("/course?id=" + $routeParams.id)
          .success(function(data, status, headers, jwr) {
            //console.log(data);

            $scope.course = data;
            $scope.course.tutor = $scope.user.id;
            if (!$scope.course.category) {
              $scope.course.category = "UE1";
            }

            $scope.testQcm = $scope.course.modules[0].questions[0];
            //$scope.title = $scope.course.title;

            $scope.newModule = {
              title: "",
              comment: "",
              questions: []
            }
            $scope.newQcm = {
              subject: "",
              comment: "",
              answers: [{
                subject: "",
                isCorrect: false,
                comment: ""
              }]
            }

            $scope.addModule = function() {
              if (!$scope.course.modules) {
                $scope.course.modules = [];
              }
              $scope.course.modules.push($scope.newModule);
              $scope.newModule = {
                title: "",
                comment: "",
                questions: []
              };
            };

            $scope.addQuestion = function() {

              if (!$scope.course.modules[$scope.course.modules.length - 1].questions) {
                $scope.course.modules[$scope.course.modules.length - 1].questions = [];
              }
              $scope.course.modules[$scope.course.modules.length - 1].questions.push($scope.newQcm);

              console.log($scope.course.modules[$scope.course.modules.length - 1].questions);
              $scope.newQcm = {
                subject: "",
                comment: "",
                answers: [{
                  subject: "",
                  isCorrect: false,
                  comment: ""
                }]
              }
            };

            $scope.addAnswer = function() {
              console.log('ok')
              if (!$scope.newQcm.answers) {
                $scope.newQcm.answers = [];
              }
              $scope.newQcm.answers.push({
                subject: "",
                isCorrect: false,
                comment: ""
              });
            };

            $scope.removeLastAnswer = function() {
              if ($scope.newQcm.answers !== undefined && $scope.newQcm.answers.length > 0) {
                $scope.newQcm.answers = $scope.newQcm.answers.slice(0, -1);
              }
            }

            $scope.removeQcm = function(question) {
              for (var i = 0; i < $scope.course.modules.length; i++) {
                if ($scope.course.modules[i].questions.indexOf(question) > -1)
                  $scope.course.modules[i].questions.splice($scope.course.modules[i].questions.indexOf(question), 1);
              }
            }

            $scope.moveQcm = function(question, isUp) {
              for (var i = 0; i < $scope.course.modules.length; i++) {
                if ($scope.course.modules[i].questions.indexOf(question) > -1) {
                  var questionIndex = $scope.course.modules[i].questions.indexOf(question);
                  var newIndex = isUp ? (questionIndex - 1 > 0 ? questionIndex - 1 : 0) : (questionIndex + 1 > $scope.course.modules[i].questions.length - 1 ? $scope.course.modules[i].questions.length - 1 : questionIndex + 1)
                  var movedElement1 = $scope.course.modules[i].questions[questionIndex];
                  var movedElement2 = $scope.course.modules[i].questions[newIndex];

                  $scope.course.modules[i].questions[questionIndex] = movedElement2;
                  $scope.course.modules[i].questions[newIndex] = movedElement1;
                }

              }
            }

            $scope.removeModule = function(moduleToDelete) {
              if ($scope.course.modules.indexOf(moduleToDelete) > -1) {
                $scope.course.modules.splice($scope.course.modules.indexOf(moduleToDelete), 1);
              }
            }
            var xTriggered = 0;
            var watch = $scope.$watch($scope.newQcm, function() {
              console.log('watch')
                /*if($scope.newQcm.answers[$scope.newQcm.answers.length -1].subject.length > 3){
                  $scope.addAnswer();
                } else {
                  watch();
                }*/

              jQuery("body").delegate(".answersubject", "keydown", function(event) {
                var currentElement = jQuery(this);
                console.log(currentElement)
                console.log($($(".answersubject")[$(".answersubject").length - 1]))
                console.log($($(".answersubject")[$(".answersubject").length - 1])[0] == currentElement[0])
                if ($($(".answersubject")[$(".answersubject").length - 1])[0] == currentElement[0]) {
                  if (currentElement.val().length > 3) {
                    $scope.addAnswer();
                  } else if (currentElement.val().length == -1) {
                    $scope.removeLastAnswer();
                  }
                }

              });

            }, true);

          });

      } else {
        $location.path('/');
      }
    });
});

superpacesApp.controller('superpacesTutorCreateCourse', function($scope, $sails, $location, $sce, $window, $http) {

  $scope.apiBaseUrl = apiBaseUrl;
  $sails.get("/auth/getUser")
    .success(function(data, status, headers, jwr) {
      $scope.CurrentUser = data;
      if ($scope.CurrentUser !== undefined && $scope.CurrentUser.id !== undefined) {

        $scope.course = {
          tutor: $scope.CurrentUser.id,
          category: "UE2"
        };

        $scope.newQcm = {
          subject: "",
          comment: "",
          answers: [{
            isCorrect: false,
            subject: "",
            comment: ""
          }]
        };

        $scope.addModule = function() {
          if (!$scope.course.modules) {
            $scope.course.modules = [];
          }

          if (!$scope.newModule.questions) {
            $scope.newModule.questions = [];
          }

          $scope.newQcm.answers.splice($scope.newQcm.answers.length - 1, 1);

          if ($scope.newQcm.subject != "" && $scope.newQcm.comment != "")
            $scope.newModule.questions.push($scope.newQcm);

          $scope.course.modules.push($scope.newModule);
          $scope.newModule = {
            title: "",
            comment: ""
          };

          $scope.newQcm = {
            subject: "",
            comment: "",
            answers: [{
              isCorrect: false,
              subject: "",
              comment: ""
            }]
          };

          $scope.answerEdited = [false];
        };


        $scope.addQuestion = function(item) {

          if (!item.questions) {
            item.questions = [];
          }

          $scope.newQcm.answers.splice($scope.newQcm.answers.length - 1, 1);

          item.questions.push($scope.newQcm);

          $scope.newQcm = {
            subject: "",
            comment: "",
            answers: [{
              isCorrect: false,
              subject: "",
              comment: ""
            }]
          };
          $scope.answerEdited = [false];
        };

        //Saves the course in the database
        $scope.addCourse = function() {

          $sails.post('/course/create', JSON.parse(angular.toJson($scope.course)))
            .success(function(response) {
              $scope.course = {
                title: "",
                subtitle: "",
                description: "",
                image: undefined,
                modules: []
              }

              angular.element("input[name='uploadImage']").val(null);
            });
        }

        //upload course image
        $scope.upload = function() {

          var fd = new FormData();
          fd.append('uploadFile', courseForm.uploadImage.files[0]);

          $http.post('http://177.10.0.11:1337/course/upload', fd, {
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            })
            .success(
              function(res) {
                console.log(res);
                $scope.course.image = res.filepath;
              });
        };

        //Adds an empty answer whenever user starts typing / Removes an answer when it's empty
        $scope.answerEdited = [false];
        $scope.answerChange = function(item, id) {
          if (item.comment.length > 1 || item.subject.length > 1) {
            $scope.answerEdited[id] = true;
          }
          if (!$scope.answerEdited[id] && (item.comment.length == 1 || item.subject.length == 1)) {
            $scope.newQcm.answers.push({
              subject: "",
              comment: "",
              isCorrect: false
            });
          }

          if (item.comment.length == 0 && item.subject.length == 0) {
            $scope.newQcm.answers.splice(id, 1);
            $scope.answerEdited[id] = false;
          }
        }
      } else {
        $location.path('/');
      }
    });
});