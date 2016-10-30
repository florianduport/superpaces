/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
		Course.create({
			title: req.param('title'),
			subtitle: req.param('subtitle'),
			description: req.param('description'),
			category: req.param('category'),
			tutor: req.param('tutor'),
			image : req.param('image'),
			modules: req.param('modules')
		}).exec(function(err, course) {
			if (err)
				return res.serverError(err);

			res.send(course);
		});
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
						filepath: files[0].fd.replace("/data/src/.tmp/public/", "http://177.10.0.11:1337/")
					});
				}
			});
	}
};