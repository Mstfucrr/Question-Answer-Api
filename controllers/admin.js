const User = require("../models/User")
const asyncErrorWrapper = require("express-async-handler")
const CustomError = require("../helpers/error/CustomError")

// block , unblock and delete user

const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params

    const user = await User.findById(id)
    user.blocked = !user.blocked
    await user.save()

    return res.status(200).json({
        success: true,
        message: `User ${user.name} ${user.blocked ? "blocked" : "unblocked"} Successfully`
    })
})

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params // id'yi al

    const user = await User.findById(id) // id'ye göre user'ı bul
    // user.remove() is not a function hatası alırsak user'ı bulduktan sonra user'ı silmek için user.remove() yerine user.deleteOne() kullanabiliriz
    await user.deleteOne() // user'ı sil


    return res.status(200).json({
        success: true,
        message: `User deleted successfully`
    })
})

module.exports = {
    blockUser,
    deleteUser
}