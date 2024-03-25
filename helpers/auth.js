const { use } = require("../routes/authRoutes")

module.exports.authCheck =  function(req, res, next) {
    const userId = req.session.userid 
    if(!userId) {
        res.redirect('/login')
    }
    next()
}