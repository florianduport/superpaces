var CourseCtrl = angular.module('CourseCtrl', ['duScroll', 'ngAnimate', 'ui.bootstrap']);

/*
 *
 * Course Controller
 */
CourseCtrl.controller('superpacesTutorCourses', function($scope, $sails, $location, $sce, RESOURCES) {
    $scope.logoutUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOGOUT);

    $sails.get(RESOURCES.CONFIG.API_AUTH_GETUSER)
        .success(function(data, status, headers, jwr) {
            $scope.user = data;
            if ($scope.user !== undefined && $scope.user.id !== undefined) {

                $sails.get(RESOURCES.CONFIG.API_COURSE_BY_TUTOR + $scope.user.id)
                    .success(function(data, status, headers, jwr) {
                        //console.log(data);

                        $scope.courses = data;

                    });

            } else {
                $location.path('/');
            }
        });
});


/*
 *
 * Course Edit Controller
 */
CourseCtrl.controller('superpacesTutorEditCourse', function($scope, $routeParams, $sails, $location, $sce, RESOURCES) {
    $scope.logoutUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOGOUT);

    $sails.get(RESOURCES.CONFIG.API_AUTH_GETUSER)
        .success(function(data, status, headers, jwr) {
            $scope.user = data;
            if ($scope.user !== undefined && $scope.user.id !== undefined) {

                $sails.get(RESOURCES.CONFIG.API_COURSE_EDIT + $routeParams.id)
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


/*
 *
 * Course Create Controller
 */
CourseCtrl.controller('superpacesTutorCreateCourse',
    function($scope, $sails, $document, $location, $sce, $window, $http, $timeout, $uibModal, RESOURCES) {

        $createCourseCtrl = this;

        $scope.openModal = function(questionId) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modal.html',
                size: 'lg',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    items: function() {
                        var item = {
                            id: questionId,
                            questionToEdit: angular.copy($scope.newModule.questions[questionId])
                        };

                        return item;
                    }
                }
            });



            modalInstance.result.then(function(selectedItem) {
                angular.forEach(selectedItem.questionEdited.answers, function(answer, key) {
                    if (!answer.subject)
                        selectedItem.questionEdited.answers.splice(selectedItem.questionEdited.answers.indexOf(answer), 1);
                });
                $scope.newModule.questions[selectedItem.id] = selectedItem.questionEdited;

            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        var scrollToOverview = function() {
            var overview = angular.element(document.getElementById('overview'));
            $document.scrollToElement(overview, 80, 500);
        }

        $scope.scrollToOverview = function() {
            $timeout(scrollToOverview, 500);
        }

        $scope.scrollToNewModule = function() {
            var newModule = angular.element(document.getElementById('newModule'));
            $document.scrollToElement(newModule, 80, 500);
        }

        $scope.logoutUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOGOUT);

        $sails.get(RESOURCES.CONFIG.API_AUTH_GETUSER)
            .success(function(data, status, headers, jwr) {
                $scope.CurrentUser = data;
                if ($scope.CurrentUser !== undefined && $scope.CurrentUser.id !== undefined) {

                    $scope.course = {
                        tutor: $scope.CurrentUser.id,
                        category: "UE2",
                        modules: []
                    };



                    $scope.newQcm = {
                        subject: "",
                        comment: "",
                        answers: [{
                            isCorrect: false,
                            subject: "",
                        }]
                    };


                    $scope.error = {
                        moduleerror: false,
                        questionerror: false,
                        courseerror: false
                    };


                    $scope.newModule = {
                        title: "",
                        comment: "",
                    };

                    $scope.newQuestion = {
                        subject: "",
                        comment: ""
                    };

                    var NbMaxAnswers = 5;

                    $scope.newAnswer = {
                        subject: "",
                        isCorrect: false
                    };





                    $scope.newModules = [];

                    $scope.showAddQuestion = true;

                    $scope.moduleIndex = $scope.newModules.length + 1;

                    $scope.initAnswers = function() {
                        var newAnswers = [];


                        for (var c = 0; c < NbMaxAnswers; c++) {
                            //$scope.newAnswer.id += 1;
                            var answer = {
                                subject: "",
                                isCorrect: false
                            };

                            newAnswers[c] = answer;
                        }

                        $scope.newAnswers = newAnswers;
                    }

                    $scope.init = function() {
                        $scope.moduleIndex = $scope.newModules.length + 1;
                    }

                    $scope.initAnswers();

                    $scope.showAddAnswer = function(id) {
                        var nbAnswers = 0;
                        if ($scope.newModule.questions[id].answers) {
                            nbAnswers = $scope.newModule.questions[id].answers.length;
                        }

                        if (nbAnswers == 0) {
                            $scope.showAddQuestion = false;
                            return true;
                        } else {
                            $scope.showAddQuestion = true;
                            return false;
                        }
                    }

                    $scope.addEmptyModule = function() {
                        $scope.newModules.push($scope.newModule);
                        $scope.newModule = {
                            title: "",
                            comment: ""
                        };

                        $scope.showAddQuestion = true;
                        $scope.init();
                        console.log($scope.newModules[0]);
                    }

                    $scope.addQuestionToModule = function(goNext) {
                        if (goNext) {
                            $scope.showAddQuestion = true;
                        } else {
                            if (!$scope.newModule.questions) {
                                $scope.newModule.questions = [];
                                $scope.showAddQuestion = true;
                            }

                            $scope.newModule.questions.push($scope.newQuestion)

                            $scope.showAddQuestion = false;

                            $scope.newQuestion = {
                                subject: "",
                                comment: ""
                            };



                        }
                    }

                    $scope.addAnswerToQuestion = function(id) {
                        if (!$scope.newModule.questions[id].answers)
                            $scope.newModule.questions[id].answers = [];

                        angular.forEach($scope.newAnswers, function(answer, key) {
                            if (answer.subject)
                                $scope.newModule.questions[id].answers.push(answer);
                        });

                        $scope.initAnswers();
                        $scope.newAnswer = {
                            subject: "",
                        };
                    }

                    $scope.addModule = function(isValid) {
                        $scope.init();

                        if (isValid) {
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
                                comment: "",
                                questions: [{
                                    subject: "",
                                    comment: "",
                                    answers: [{
                                        subject: "",
                                        comment: "",
                                        isCorrect: false
                                    }]
                                }]
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
                            $scope.error.moduleerror = false;
                        } else {
                            $scope.error.moduleerror = true;
                        }
                    };

                    $scope.removeModule = function(moduleToDelete) {
                        if ($scope.newModules.indexOf(moduleToDelete) > -1) {
                            $scope.newModules.splice($scope.newModules.indexOf(moduleToDelete), 1);
                        }
                    }

                    $scope.removeQcm = function(question) {
                        for (var i = 0; i < $scope.newModules.length; i++) {
                            if ($scope.newModules[i].questions.indexOf(question) > -1)
                                $scope.newModules[i].questions.splice($scope.newModules[i].questions.indexOf(question), 1);
                        }
                    }

                    $scope.moveQcm = function(question, isUp) {
                        for (var i = 0; i < $scope.newModules.length; i++) {
                            if ($scope.newModules[i].questions.indexOf(question) > -1) {
                                var questionIndex = $scope.newModules[i].questions.indexOf(question);
                                var newIndex = isUp ? (questionIndex - 1 > 0 ? questionIndex - 1 : 0) : (questionIndex + 1 > $scope.newModules[i].questions.length - 1 ? $scope.newModules[i].questions.length - 1 : questionIndex + 1)
                                var movedElement1 = $scope.newModules[i].questions[questionIndex];
                                var movedElement2 = $scope.newModules[i].questions[newIndex];

                                $scope.newModules[i].questions[questionIndex] = movedElement2;
                                $scope.newModules[i].questions[newIndex] = movedElement1;
                            }
                        }
                    }

                    //Saves the course in the database
                    $scope.addCourse = function(isValid) {
                        if (isValid) {
                            $sails.post(RESOURCES.CONFIG.API_COURSE_CREATE, JSON.parse(angular.toJson($scope.course)))
                                .success(function(response) {
                                    console.log(response);
                                    $scope.course = {
                                        title: "",
                                        subtitle: "",
                                        description: "",
                                        image: undefined,
                                        modules: []
                                    }
                                    $scope.success = $sce.trustAsHtml(RESOURCES.MESSAGES.SUCESS_CREATE_COURSE);
                                    angular.element("input[name='uploadImage']").val(null);
                                })
                                .error(function(err) {
                                    console.log(err);
                                    $scope.serverError = err.serverError;

                                });
                            $scope.error.courseerror = false;
                        } else {
                            $scope.error.courseerror = true;
                        }
                    }

                    //upload course image
                    $scope.upload = function() {
                        var fileToUpload = courseForm.uploadImage.files[0];

                        if (fileToUpload == undefined)
                            return false;


                        var fd = new FormData();

                        if (RESOURCES.CONFIG.ALLOWED_FILE_TYPES.indexOf(fileToUpload.type) == -1 || fileToUpload.size > 500000) {

                            $scope.showLoading = false;
                            $scope.uploadError = $sce.trustAsHtml(RESOURCES.MESSAGES.UPLOAD_ERROR);

                        } else {
                            $scope.showLoading = true;
                            fd.append('uploadFile', courseForm.uploadImage.files[0]);
                            var uploadUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL) + RESOURCES.CONFIG.API_COURSE_UPLOAD;
                            $http.post(uploadUrl, fd, {
                                    transformRequest: angular.identity,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                })
                                .success(
                                    function(res) {
                                        console.log(res);
                                        $scope.uploadError = undefined;
                                        $scope.course.image = res.filepath;
                                        $scope.showLoading = false;
                                    })
                                .error(function(err) {
                                    $scope.showLoading = false;
                                    $scope.uploadError = $sce.trustAsHtml(RESOURCES.MESSAGES.UPLOAD_ERROR);
                                });
                        }

                    };

                } else {
                    $location.path('/');
                }
            });
    });


CourseCtrl.controller('ModalInstanceCtrl',
    function($scope, $uibModalInstance, items) {
        $ctrl = this;

        $ctrl.currentQuestion = angular.copy(items.questionToEdit);

        var diff = 5 - $ctrl.currentQuestion.answers.length;

        if (diff > 0) {
            for (var i = 0; i < diff; i++) {
                $ctrl.currentQuestion.answers.push({});
            }
        }

        var returnValue = {
            id: items.id,
            questionEdited: $ctrl.currentQuestion
        };

        $ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $ctrl.save = function() {

            $uibModalInstance.close(returnValue);

        };


    });
