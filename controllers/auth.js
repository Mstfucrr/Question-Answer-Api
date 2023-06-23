const User = require("../models/User")
const asyncErrorWrapper = require("express-async-handler")
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers")
const { validateUserInput, comparePasword } = require("../helpers/input/inputHelpers")
const CustomError = require("../helpers/error/CustomError")
const sendEmail = require("../helpers/libraries/sendEmail")

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

const getUser = async (req, res, next) => {

    const id = req.user.id //user'ın id'sini al

    await User.findById(id).then((user) => { //id'ye göre user'ı bul
        return res.status(200).json({
            success: true,
            data: user
        })
    }).catch(err => {
        return next(new CustomError(err.message, 400))
    }
    )

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

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`; //token'ı url'e ekle
    const emailTemplate = `
        <h3>Parolanızı sıfırlamak için lütfen aşağıdaki.</h3> <br>
        <p><a href="${resetPasswordUrl}" target="_blank">
            Linke Tıklayınız
        </a></p>

        <h4>Not: Link 1 saat sonra geçersiz olacaktır.</h4>
            
    `;
    try {
        await sendEmail({
            from: process.env.SMTP_EMAIL, //process.env'den alınan değerler
            to: resetEmail, //req'den body'den alınan değerler
            subject: "Parola Sıfırlama İsteği", //subject
            html: emailTemplate //email template'i
        });

        return res.status(200).json({
            success: true,
            message: "Token Eposta Adresinize Gönderildi"
        });

    } catch (err) {
        user.resetPasswordToken = undefined; //token'ı undefined yap
        user.resetPasswordExpire = undefined;
        await user.save(); //kaydet 
        return next(new CustomError("Email could not be sent", 500)); //hata döndür
    }

});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const { resetPasswordToken } = req.query; //req'den query'den alınan token değeri
    const { password } = req.body; //req'den body'den alınan yeni password değeri

    if (!resetPasswordToken) { //token yoksa
        return next(new CustomError("Please provide a valid token", 400)); //hata döndür
    }

    let user = await User.findOne({ //token'a göre user'ı bul
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } //token'ın süresi dolmamışsa yani şu anki tarihten büyükse  gt: büyük , lt: küçük
    });

    if (!user) { //user yoksa
        return next(new CustomError("Invalid Token or Session Expired", 404)); //hata döndür
    }

    user.password = password; //user'ın password'ünü yeni password ile değiştir
    user.resetPasswordToken = undefined; //token'ı undefined yap
    user.resetPasswordExpire = undefined; //token'ın süresini undefined yap

    await user.save(); //kaydet

    return res.status(200)
        .json({
            success: true,
            message: "Reset Password Successful"
        });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInformation = req.body; //req'den body'den alınan değerler
    const user = await User.findByIdAndUpdate(req.user.id, editInformation, { //id'ye göre user'ı bul ve güncelle
        new: true, //güncellenmiş user döndürmesi için
        runValidators: true //validasyonu çalıştırması için
    })
    res.status(200).json({
        success: true,
        data: user //güncellenmiş user döndürmesi için
    })

})

module.exports = {
    register, login, logout, imageUpload, getUser, forgotPassword, resetPassword, editDetails
};