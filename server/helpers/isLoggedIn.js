//has access to the session because req is passed to this function
//for endpoints that should only be reached when the user is logged in
function isLoggedIn(req, res, next) {
    if (req.session && req.session.user_id) {
        return next();
    }
    return res.status(401).json({ message: 'Not authorized' });
}

module.exports = isLoggedIn; 