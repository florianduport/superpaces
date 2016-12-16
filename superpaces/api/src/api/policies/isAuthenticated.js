var baseUrl = sails.config.globals.baseUrl;

module.exports = function(req, res, next) {
    if (req.isSocket && req.session && req.session.passport && req.session.passport.user) {
        return next();
    } else {
        res.json(401);
    }
};
