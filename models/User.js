const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const Question = require('./Question');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email address"
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: 'string',
        minLength: [6, "Please provide a Password with at least 6 characters"],
        required: [true, "Please Enter Password"],
        select: false,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    title: { type: String },
    about: { type: String },
    place: { type: String },
    website: { type: String },
    profile_image: { type: String, default: "default.jpg" },
    blocked: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }

});

UserSchema.methods.generateJwtFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env
    const payload = {
        id: this._id,
        name: this.name
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    })
    return token;

}

UserSchema.methods.getResetPasswordTokenFromUser = function () {
    const randomHexString = crypto.randomBytes(15).toString("hex"); //15 karakterlik random hex string oluşturur bu stringi token olarak kullanacağız

    const { RESET_PASSWORD_EXPIRE } = process.env; //env dosyasından reset password expire süresini alırız

    const resetPasswordToken = crypto
        .createHash("SHA256") //sha256 ile hash'leriz, hash = string'i şifreler
        .update(randomHexString) //random hex string'i update ile hash'leriz 
        .digest("hex"); //random hex string'i sha256 ile hash'leriz ve digest ile hex formatında döndürürüz 
    
    this.resetPasswordToken = resetPasswordToken; //user'ın resetPasswordToken'ını oluşturduğumuz token ile güncelleriz
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE); //user'ın resetPasswordExpire'ını şu anki zamana eklediğimiz süre kadar arttırırız

    console.log(this.resetPasswordToken, this.resetPasswordExpire);
    return resetPasswordToken; //oluşturduğumuz token'ı döndürürüz
};

UserSchema.pre('save', function (next) {
    if (!this.isModified("password")) {  //eğer password değişmemişse next ile bir sonraki middleware'e geçeriz
        next(); //next ile bir sonraki middleware'e geçeriz
    }

    bcrypt.genSalt(10, (err, salt) => { //10 karakterlik salt oluştururuz
        if (err) next(err); //hata varsa next ile bir sonraki middleware'e geçeriz

        bcrypt.hash(this.password, salt, (err, hash) => { //parolayı salt ile hash'leriz
            if (err) next(err); //hata varsa next ile bir sonraki middleware'e geçeriz
            this.password = hash; //hashlenmiş parolayı user'ın password'ine atarız
            next(); //next ile bir sonraki middleware'e geçeriz
        })
    })
});
// deleteOne() ile user'ı silmek için bu şekilde bir middleware yazabiliriz
UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this;
    await Question.deleteMany({ user: user._id });
    next();
});


module.exports = mongoose.model("User", UserSchema)
