const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: [true, "Please try different Email"],
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

module.exports = mongoose.model("User", UserSchema)
