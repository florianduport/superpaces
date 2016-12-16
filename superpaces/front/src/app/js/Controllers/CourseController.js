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
            $sails.get(RESOURCES.CONFIG.API_COURSE_BY_TUTOR + $scope.user.id)
                .success(function(data, status, headers, jwr) {
                    $scope.courses = data;
                })
                .error(function(err) {
                    $location.path('/');
                });
        });
});

/*
 *
 * Course Create Controller
 */
CourseCtrl.controller('superpacesTutorCreateCourse',
    function($scope, $sails, $document, $location, $sce, $window, $http, $timeout, $uibModal, $routeParams, RESOURCES) {

        var openModal = function(templateUrl, size, controller, controllerAs, dataInput) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: templateUrl,
                size: size,
                controller: controller,
                controllerAs: controllerAs,
                resolve: {
                    data: function() {
                        return dataInput;
                    }
                }
            });

            modalInstance.result.then(
                function(selectedItem) {
                    //if we come from ModuleOverviewModal
                    if (selectedItem.module) {
                        $scope.addEmptyModule();
                        $scope.scrollToOverview();
                    }

                    //if we come from EditQuestionModel
                    if (selectedItem.questionEdited) {
                        angular.forEach(selectedItem.questionEdited.answers, function(answer, key) {
                            if (!answer.subject)
                                selectedItem.questionEdited.answers.splice(selectedItem.questionEdited.answers.indexOf(answer), 1);
                        });
                        $scope.newModule.questions[selectedItem.id] = selectedItem.questionEdited;
                    }

                    //if we come from yesno modal
                    if (selectedItem.callback)
                        selectedItem.callback(selectedItem.callbackParams);
                },
                function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
        };



        $scope.openEditQuestionModal = function(questionId) {
            openModal(
                'EditQuestionModal.html',
                'lg',
                'EditQuestionModalInstanceCtrl',
                '$EditQuestionCtrl', {
                    questionToEdit: angular.copy($scope.newModule.questions[questionId]),
                    id: questionId
                });
        };

        $scope.openModuleOverviewModal = function() {
            openModal(
                'ModuleOverviewModal.html',
                'lg',
                'ModuleOverviewModalInstanceCtrl',
                '$ModuleOverviewCtrl', {
                    module: angular.copy($scope.newModule)
                });
        };

        $scope.openYesNoModal = function(messageId, callback, params) {
            openModal(
                'YesNoModal.html',
                'md',
                'YesNoModalInstanceCtrl',
                '$YesNoCtrl', {
                    title: angular.copy(RESOURCES.MESSAGES.MODAL[messageId].TITLE),
                    message: angular.copy(RESOURCES.MESSAGES.MODAL[messageId].MESSAGE),
                    callback: callback,
                    callbackParams: params
                });
        }

        var deleteStuff = function(id) {
            console.log('Stuff deleted :' + id);
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



                    //EDIT
                    if ($routeParams.id) {
                        $sails.get(RESOURCES.CONFIG.API_COURSE_EDIT + $routeParams.id)
                            .success(function(courseToEdit, status, headers, jwr) {
                                //console.log(data);

                                $scope.course = courseToEdit;
                                $scope.course.tutor = $scope.CurrentUser.id;
                                $scope.newModules = courseToEdit.modules;
                                if (!$scope.course.category) {
                                    $scope.course.category = "UE1";
                                }
                            });
                    }

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
                        $scope.course.modules = $scope.newModules;
                        if (isValid) {
                            $sails.post(RESOURCES.CONFIG.API_COURSE_CREATE, JSON.parse(angular.toJson($scope.course)))
                                .success(function(response) {

                                    if (!$scope.course.id) {
                                        $scope.success = $sce.trustAsHtml(RESOURCES.MESSAGES.SUCCESS_CREATE_COURSE);
                                    } else {
                                        $scope.success = $sce.trustAsHtml(RESOURCES.MESSAGES.SUCCESS_UPDATE_COURSE);
                                    }

                                    /*$scope.course = {
                                        title: "",
                                        subtitle: "",
                                        description: "",
                                        image: undefined,
                                        modules: []
                                    }
                                    angular.element("input[name='uploadImage']").val(null);*/
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


CourseCtrl.controller('EditQuestionModalInstanceCtrl',
    function($scope, $uibModalInstance, data) {
        $ctrl = this;

        $ctrl.currentQuestion = angular.copy(data.questionToEdit);

        var diff = 5 - $ctrl.currentQuestion.answers.length;

        if (diff > 0) {
            for (var i = 0; i < diff; i++) {
                $ctrl.currentQuestion.answers.push({});
            }
        }

        var returnValue = {
            id: data.id,
            questionEdited: $ctrl.currentQuestion
        };

        $ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $ctrl.save = function() {

            $uibModalInstance.close(returnValue);

        };
    });


CourseCtrl.controller('ModuleOverviewModalInstanceCtrl',
    function($scope, $uibModalInstance, data) {
        $ctrl = this;
        $ctrl.module = angular.copy(data.module);

        $ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $ctrl.save = function() {
            $uibModalInstance.close({
                module: $ctrl.module
            });
        }
    });


CourseCtrl.controller('YesNoModalInstanceCtrl',
    function($scope, $uibModalInstance, data) {
        $ctrl = this;
        $ctrl.title = angular.copy(data.title);
        $ctrl.message = angular.copy(data.message);

        $ctrl.no = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $ctrl.yes = function() {
            $uibModalInstance.close({
                callback: data.callback,
                callbackParams: data.callbackParams
            });
        }
    });
