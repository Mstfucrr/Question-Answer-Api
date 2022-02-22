const User = require("../models/User")
const asyncErrorWrapper = require("express-async-handler")
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers")
const { validateUserInput, comparePasword } = require("../helpers/input/inputHelpers")
const CustomError = require("../helpers/error/CustomError")

const register = asyncErrorWrapper(async (req, res, next) => {
    const { name, email, password, role } = req.body
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    sendJwtToClient(user, res)
});

const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body
    if (!validateUserInput(email, password))
        return next(new CustomError("Please check your inputs", 400));

    const user = await User.findOne({ email }).select("+password")

    if (!user || !comparePasword(password, user.password)) {
        return next(new CustomError("Please check your email or password", 400));
    }
    sendJwtToClient(user, res)
})

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env
    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        message: "You have been logged out"
    });
})

const getUser = (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
}

module.exports = {
    register, login, logout, getUser
};