const Question = require('../models/Question');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {

    const information = req.body;

    const question = await Question.create({
        ...information,
        user: req.user.id
    });

    res.status(200)
        .json({
            success: true,
            data: question
        });
});

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {

    console.log(req.query)
    let query = Question.find();
    // search    
    if (req.query.search) {
        query = query.where('title', new RegExp(req.query.search, 'i'));
    }

    // populate
    let populate = true;
    let populateObject = {
        path: 'user',
        select: 'name profile_image'
    }
    if (populate) {
        query = query.populate(populateObject);
    }

    // pagination
    const page = parseInt(req.query.page) || 1; // eğer page yoksa 1. sayfayı göster
    const limit = parseInt(req.query.limit) || 5; // eğer limit yoksa 5 veri göster

    const startIndex = (page - 1) * limit; // start index : sayfa 1 ise 0, sayfa 2 ise 5, sayfa 3 ise 10
    const endIndex = page * limit; // end index : sayfa 1 ise 5, sayfa 2 ise 10, sayfa 3 ise 15

    const pagination = {};
    const total = await Question.countDocuments(); // toplam veri sayısı
    if (startIndex > 0) { // eğer 1. sayfada değilsek, önceki sayfaya geçebiliriz
        pagination.previous = { 
            page: page - 1,
            limit: limit
        }
    }

    if (endIndex < total) { // eğer end index toplam veri sayısından küçükse, sonraki sayfaya geçebiliriz
        pagination.next = { // sonraki sayfaya geçebiliriz
            page: page + 1,
            limit: limit
        }
    }
    query = query.skip(startIndex).limit(limit);
    
    // sort : req.query.sortBy = createdAt:desc, title:asc, most-answered, most-liked

    const sortKey = req.query.sortBy; 
    if (sortKey === 'most-answered') { // en çok cevaplanan soruları getir
        query = query.sort('-answerCount -createdAt');
    } else if (sortKey === 'most-liked') { // en çok beğenilen soruları getir
        query = query.sort('-likeCount -createdAt');
    } else {
        query = query.sort('-createdAt');
    }


    const questions = await query;

    return res.status(200)
        .json({
            success: true,
            count: questions.length,
            pagination: pagination,
            data: questions

        })

});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findById(id);

    return res.status(200)
        .json({
            success: true,
            data: question
        })
});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const information = req.body;

    let question = await Question.findById(id);
    question.title = information.title || question.title; // eğer title yoksa eski title'ı kullan
    question.content = information.content || question.content; // eğer content yoksa eski content'ı kullan

    question = await question.save();

    return res.status(200)
        .json({
            success: true,
            data: question
        })
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    await Question.findByIdAndDelete(id);

    return res.status(200)
        .json({
            success: true,
            message: "Question deleted successfully"
        })
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findById(id); // soruyu bul
 
    if (question.likes.includes(req.user.id)) {
        return next(new CustomError("You already liked this question", 400)); // eğer kullanıcı daha önce like yapmışsa hata döndür
    }

    question.likes.push(req.user.id); // kullanıcının id'sini sorunun like'larına ekle
    question.likeCount = question.likes.length; // sorunun like sayısını güncelle
    await question.save(); // kaydet

    return res.status(200).json({
        success: true,
        data: question,
        message: "Liked the question"
    })

});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const question = await Question.findById(id); // soruyu bul

    if (!question.likes.includes(req.user.id)) { // eğer kullanıcı daha önce like yapmadıysa
        return next(new CustomError("You can not undo like operation for this question", 400)); // hata döndür
    }

    const index = question.likes.indexOf(req.user.id); // kullanıcının id'sinin indexini bul

    question.likes.splice(index, 1); // bulduğun indexi sil
    question.likeCount = question.likes.length; // sorunun like sayısını güncelle

    await question.save(); // kaydet

    return res.status(200).json({
        success: true,
        data: question,
        message: "Undo Like for the question"
    })
});


module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
};