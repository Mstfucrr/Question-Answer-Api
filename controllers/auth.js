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
    const { email, password } = req.body //postman'de body'den alınan değerler
    if (!validateUserInput(email, password))  //email ve password boş mu kontrolü
        return next(new CustomError("Please check your inputs", 400)); 

    const user = await User.findOne({ email }).select("+password") //email'e göre user'ı bulup password'u da getir 

    if (!user || !comparePasword(password, user.password)) { //user yoksa veya password yanlışsa
        return next(new CustomError("Please check your email or password", 400)); //hata döndür
    }
    sendJwtToClient(user, res) //user varsa token döndür 
})

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env
    return res.status(200).cookie({
        httpOnly: true, //sadece server tarafından değiştirilebilir
        expires: new Date(Date.now()), //cookie'nin süresi dolmuş olacak ve silinecek 
        secure: NODE_ENV === "development" ? false : true //https olmadığında çalışmaz 
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
const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage //middleware'den gelen değer
    }, {
        new: true, //güncellenmiş user döndürmesi için
        runValidators: true //validasyonu çalıştırması için
    })
    res.status(200).json({
        success: true, 
        message: "Image Upload Successful",
        data: user //güncellenmiş user döndürmesi için
    })
})

// Forgot Password
const forgotPassword = (async (req, res, next) => {

    const resetEmail = req.body.email; //req'den body'den alınan değerler
    const user = await User.findOne({ email: resetEmail }); //email'e göre user'ı bul
    // JWT Token tanımı : Bir kullanıcının kimliğini doğrulamak için kullanılan bir JSON nesnesidir.
    if (!user) { //user yoksa
        return next(new CustomError("There is no user with that email", 400)); //hata döndür
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser(); //random token oluşturur

    await user.save(); //token'ı kaydet
    
    res.json({
        success: true,
        message: "Token sent to your email" 
    });


});



module.exports = {
    register, login, logout, imageUpload, getUser, forgotPassword
};