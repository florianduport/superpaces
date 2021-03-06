/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var baseApiUrl = sails.config.globals.baseApiUrl;

module.exports = {

    getById: function(req, res) {
        Course.find({
            id: req.param('id')
        }).exec(function(err, course) {
            if (err)
                return res.serverError(err);

            return res.json(course);
        });
    },

    create: function(req, res) {
        var modules = req.param('modules');
        var isValidCourse = false;


        //check that there is at least one Module
        if (modules != undefined && modules.length > 0) {
            modules.forEach(function(module, index) {

                //check that Module has Title and Comment
                if (module != undefined && module.title != undefined && module.comment != undefined) {
                    //check that Module contains at least one QCM
                    if (module.questions != undefined && module.questions.length > 0) {
                        var questions = module.questions;
                        questions.forEach(function(question, index) {
                            //check that QCM has Subject and Comment
                            if (question != undefined && question.subject != undefined && question.comment != undefined) {
                                // check that QCM contains at leat two Answers
                                if (question.answers != undefined && question.answers.length > 1) {
                                    var answers = question.answers;
                                    answers.forEach(function(answer, index) {
                                        //check that Answer has Subject and Comment
                                        if (answer != undefined && answer.subject != undefined) {
                                            //all good
                                        } else {
                                            return res.badRequest({
                                                serverError: 'Réponse Invalide'
                                            });
                                        }
                                    });
                                    //Validate the Course
                                    isValidCourse = true;
                                } else {
                                    return res.badRequest({
                                        serverError: 'Le QCM doit contenir au moins deux réponses !'
                                    });
                                }
                            } else {
                                return res.badRequest({
                                    serverError: 'QCM Invalide'
                                });
                            }
                        });

                    } else {
                        return res.badRequest({
                            serverError: 'Le Module doit contenir au moins un QCM !'
                        });
                    }
                } else {
                    return res.badRequest({
                        serverError: 'Module Invalide'
                    });
                }
            });
        } else {
            return res.badRequest({
                serverError: 'La Colle doit contenir au moins un Module !'
            });
        }

        //check isValidCourse and Create the Course in Datanbase
        if (isValidCourse) {
            var newCourse = {
                title: req.param('title'),
                subtitle: req.param('subtitle'),
                description: req.param('description'),
                category: req.param('category'),
                tutor: req.param('tutor'),
                image: req.param('image'),
                modules: req.param('modules')
            };

            console.log('###NABIL### NEW COURSE : ' + newCourse.title + ' ' + newCourse.subtitle);
            if (req.param('id')) {
                Course.find({
                    id: req.param('id')
                }).exec(function(err, course) {
                    if (err)
                        return res.serverError(err);

                    console.log('###NABIL### COURSE EXISTS WE CREATE IT');
                    Course.update({ id: req.param('id') },
                        newCourse,
                        function(err, updated) {
                            if (err)
                                return res.serverError(err);


                            console.log('###NABIL### UPDATED COURSE : ' + updated[0]);
                            res.send(updated);
                        });

                });
            } else {
                console.log('###NABIL### IT IS A NEW COURSE');
                Course.create(newCourse).exec(function(err, course) {
                    if (err)
                        return res.serverError(err);

                    res.send(course);
                });
            }

        }
    },

    upload: function(req, res) {
        if (req.method === 'GET')
            return res.json({
                'status': 'GET not allowed'
            });

        var allowedTypes = ['image/jpeg', 'image/png'];
        var uploadFile = req.file('uploadFile');



        uploadFile.upload({
                saveAs: function(file, cb) {
                    var now = new Date();
                    var extension = file.filename.split('.').pop();
                    // generating unique filename with extension
                    var uuid = file.filename + "_" + now.getMilliseconds() + "." + extension;
                    if (allowedTypes.indexOf(file.headers['content-type']) === -1) {
                        return res.serverError({
                            file: file
                        });
                    } else {
                        cb(null, uuid);
                    }
                },
                maxBytes: 500000, //500KB
                dirname: require('path').resolve(sails.config.appPath, '.tmp/public/uploads')
            },

            function onUploadComplete(err, files) {
                if (err) return res.serverError(err);

                if (files.length > 0) {
                    res.send({
                        filepath: files[0].fd.replace("/data/src/.tmp/public/", baseApiUrl)
                    });
                }
            });
    }
};
