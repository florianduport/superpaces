/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var baseUrl = 'http://137.74.40.175/'
module.exports = {

	getById: function(req, res) {
		Course.find({
			id: req.param('id')
		}).populate('modules').exec(function(err, course) {
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
										if (answer != undefined && answer.subject != undefined && answer.comment != undefined) {
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
			Course.create({
				title: req.param('title'),
				subtitle: req.param('subtitle'),
				description: req.param('description'),
				category: req.param('category'),
				tutor: req.param('tutor'),
				image: req.param('image'),
				modules: req.param('modules')
			}).exec(function(err, course) {
				if (err)
					return res.serverError(err);

				res.send(course);
			});
		}
	},

	upload: function(req, res) {
		if (req.method === 'GET')
			return res.json({
				'status': 'GET not allowed'
			});

		var uploadFile = req.file('uploadFile');
		uploadFile.upload({
				dirname: require('path').resolve(sails.config.appPath, '.tmp/public/uploads')
			},
			function onUploadComplete(err, files) {
				if (err) return res.serverError(err);

				if (files.length > 0) {
					res.send({
						filepath: files[0].fd.replace("/data/src/.tmp/public/", baseUrl)
					});
				}
			});
	}
};