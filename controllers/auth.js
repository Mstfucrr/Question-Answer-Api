const User = require("../models/User")
const CustomError = require("../helpers/error/CustomError")

const register = async (req, res, next) => {
    const name = "Mustafa Uçar";
    const email = "mm@gmail.com";
    const password = "111111"

    try {
        const user = await User.create({
            name,
            email,
            password
        })
        res
            .status(200)
            .json({ success: true, data: user })
    } catch (error) {
        return next(error); // async işlemlerde try catch gerekli
    }

};


const errorTest = (req, res, next) => {
    return next(new TypeError("Custom Bir hata oluştu"));
}

module.exports = {
    register, errorTest
};