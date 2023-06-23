const User = require("../models/User")
const CustomError = require('../helpers/error/CustomError')
const asyncErrorWrapper = require('express-async-handler')


const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find() //tüm user'ları getir; find() içine bir şey yazmazsak tüm user'ları getirir
    return res.status(200).json({
        success: true,
        data: users
    })
});

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params //routers/user.js'den gelen id değeri

    const user = await User.findById(id) //id'ye göre user'ı bul

    return res.status(200).json({
        success: true,
        data: user
    })
});

module.exports = {
    getSingleUser, getAllUsers
}