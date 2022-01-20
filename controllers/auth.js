const User = require("../models/User")
const asyncHandler = require("express-async-handler")
const CustomError = require("../helpers/error/CustomError")

const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    res
        .status(200)
        .json({ success: true, data: user })
});


const errorTest = (req, res, next) => {
    return next(new SyntaxError("Custom Bir hata oluştu"));
}

module.exports = {
    register, errorTest
};