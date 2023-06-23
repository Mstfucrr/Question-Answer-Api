const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const chechUserExist = asyncErrorWrapper(async (req, res, next) => { // asyncErrorWrapper ile try-catch bloğuna gerek kalmıyor, hata yakalama işlemini burada yapıyoruz
    const { id } = req.params; 

    const user = await User.findById(id); //id'ye göre user'ı bul

    if (!user) {
        return next(new CustomError("There is no such user with that id", 400))
    }
    // req.data = user; //user varsa req.data'ya user'ı ata. Bu şekilde getSingleUser'a gitmeden önce req.data'ya user'ı atamış oluyoruz ( veri tabanı büyük ise bu işlemi yapmamız daha iyi olur)
    next(); //user varsa next() ile getSingleUser'a git ve user'ı getir
});

module.exports = {
    chechUserExist
}
