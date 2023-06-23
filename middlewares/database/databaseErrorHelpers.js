const User = require("../../models/User");
const Question = require("../../models/Question");
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

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params; // id'yi req.params'dan al, eğer req.params'da yoksa req.query'den al

    const question = await Question.findById(id); //id'ye göre question'ı bul

    if (!question) {
        return next(new CustomError("There is no such question with that id", 400))
    }

    next(); //question varsa next() ile getSingleQuestion'a git ve question'ı getir
});


module.exports = {
    chechUserExist,
    checkQuestionExist
}
