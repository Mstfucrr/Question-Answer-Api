const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify'); // başlıktan otomatik slug oluşturmak için
const Answer = require('./Answer');

const QuestionSchema = new Schema({
    title : {
        type : String, 
        required : [true, 'Please provide a title'], // başlık girilmesi zorunlu
        minlength : [10, 'Please provide a title at least 10 characters'], // en az 10 karakter olmalı
        unique : [true, 'Please provide a unique title'], // başlık benzersiz olmalı
    },
    content : {
        type : String,
        required : [true, 'Please provide a content'], // içerik girilmesi zorunlu
        minlength : [20, 'Please provide a content at least 20 characters'] // en az 20 karakter olmalı
    },
    slug : String, // başlıktan oluşturulacak örnek : bu bir başlık -> bu-bir-baslik
    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId, // user id'si
        required : true, // zorunlu
        ref : 'User' // User modeline referans veriyoruz
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ],
    answers : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'Answer'
        }
    ]

});

QuestionSchema.pre('save', function(next) { // Question modeline kayıt olmadan önce çalışacak fonksiyon
    if(!this.isModified('title')) { // eğer title değişmemişse
        next(); // devam et
    }
    this.slug = this.makeSlug(); // title'dan slug oluştur
    next();

});

QuestionSchema.methods.makeSlug = function() { // title'dan slug oluşturacak fonksiyon
    return slugify(this.title, {
        replacement : '-', // boşluk yerine - koy
        remove : /[*+~.()'"!:@]/g, // bu karakterleri sil
        lower : true // hepsini küçük harfe çevir
    });
}


module.exports = mongoose.model('Question', QuestionSchema); // Question modelini dışarıya açıyoruz