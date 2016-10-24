/**
 * ModuleController
 *
 * @description :: Server-side logic for managing modules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req, res) {

		Module.create({
			title: req.param('title'),
			comment: req.param('comment'),
			course : req.param('course')
		}).exec(function(err, module) {
			if (err)
				return res.serverError(err);

			res.send(module.toJSON());
		});
	}

};