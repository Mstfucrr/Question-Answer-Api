const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

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
    blocked: { type: Boolean, default: false }

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

UserSchema.pre('save', function (next) {
    //parola değişmemişse
    if (!this.isModified("password")) {
        next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err);
            this.password = hash;
            next();
        })
    })
})

module.exports = mongoose.model("User", UserSchema)
