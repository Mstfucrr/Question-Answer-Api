const multer = require('multer');
const path = require('path');
const CustomError = require("../../helpers/error/CustomError")

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // dosyanın nereye kaydedileceğini belirliyoruz
        const rootDir = path.dirname(require.main.filename) // server.js
        cb(null, path.join(rootDir, "/public/uploads")) 
    },

    filename: function (req, file, cb) {
        const extension = file.mimetype.split('/')[1] // burada image/png gibi birşey döndürüyor split ile / dan sonrasını alıyoruz
        req.savedProfileImage = "image_" + req.user.id + "." + extension; // image_1.png şeklinde bir isim oluşturuyoruz 
        cb(null, req.savedProfileImage); // bu ismi cb ile döndürüyoruz
    }
})
const fileFilter = (req,file, cb) => {
    let allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"] // izin verilen dosya tipleri
    if (!allowedMimeTypes.includes(file.mimetype)) { // eğer dosya tipleri arasında değilse
        return cb(new CustomError("Please provide a valid image file ", 400),false); // hata döndürüyoruz 
    }
    return cb(null, true); // değilse devam ediyoruz
}

const profileImageUpload = multer({storage,fileFilter}) // storage ve fileFilteri burada kullanıyoruz

module.exports = profileImageUpload