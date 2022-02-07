const CustomError = require('../../helpers/error/CustomError')
const jwt = require('jsonwebtoken')
const { isTokenInculed, getAccessTokenFromHeaders } = require('../../helpers/authorization/tokenHelpers')

const getAccessToRoute = (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env
    if (!isTokenInculed(req)) {
        return next(new CustomError("You are not authorization to access this route", 401));
    }
    const accessToken = getAccessTokenFromHeaders(req)
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError("You are not authorization to access this route", 401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        next();
    })
}

module.exports = {
    getAccessToRoute
}