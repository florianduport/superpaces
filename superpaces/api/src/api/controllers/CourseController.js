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
			description : req.param('description'),
			category : req.param('category'),
			tutor : req.param('tutor')
		}).exec(function(err, course) {
			if (err)
				return res.serverError(err);

			res.send(course.toJSON());
		});
	}
};