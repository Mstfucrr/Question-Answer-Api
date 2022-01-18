const User = require("../models/User")

const register = async (req, res, next) => {
    const name = "MUstafa Uçar";
    const email = "mmgmail.com";
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
    throw new Error("Bir hata oluştu");
}

module.exports = {
    register, errorTest
};