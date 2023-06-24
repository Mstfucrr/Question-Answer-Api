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
    return res.status(200)
        .json(res.queryResults);
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