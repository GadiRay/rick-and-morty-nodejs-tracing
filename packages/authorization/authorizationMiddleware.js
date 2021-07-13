function authorizationMiddleware(req, res, next) {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization !== 'Basic 12345') {
        return res.status(401).json({ message: 'Invalid Authorization Header' });
    }

    return next();
}

module.exports = authorizationMiddleware;
