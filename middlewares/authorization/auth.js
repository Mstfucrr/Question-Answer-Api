const CustomError = require('../../helpers/error/CustomError')
const jwt = require('jsonwebtoken')
const { isTokenInculed, getAccessTokenFromHeaders } = require('../../helpers/authorization/tokenHelpers')
const asyncErrorWrapper = require('express-async-handler')
const User = require('../../models/User')
const Question = require('../../models/Question')
const Answer = require('../../models/Answer')

const getAccessToRoute = (req, res, next) => { 
    const { JWT_SECRET_KEY } = process.env //env'den secret key'i al
    if (!isTokenInculed(req)) { //token yoksa
        return next(new CustomError("You are not authorization to access this route", 401)); //hata döndür
    }
    const accessToken = getAccessTokenFromHeaders(req) //token varsa al
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => { //token'ı verify et
        if (err) { //token geçersizse
            return next(new CustomError("You are not authorization to access this route", 401)); //hata döndür
        }
        req.user = { //token geçerliyse user'ı al
            id: decoded.id,
            name: decoded.name
        }
        next(); //devam et
    })
}

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user //user'ın id'sini al

    const user = await User.findById(id) //id'ye göre user'ı bul
    if (user.role !== "admin") { //admin değilse
        return next(new CustomError("Only admins can access this route", 403))
    } //admin değilse hata döndür
    next(); //adminse devam et

});

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id //user'ın id'sini al
    const questionId = req.params.id //id'yi al

    const question = await Question.findById(questionId) //id'ye göre question'ı bul
    
    if (question.user != userId) { //user'ın id'si question'ın user'ının id'sine eşit değilse
        return next(new CustomError("Only owner can handle this operation", 403))
    } //user'ın id'si question'ın user'ının id'sine eşit değilse hata döndür 

    next(); //eşitse devam et  
});

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id //user'ın id'sini al
    const answerId = req.params.answer_id //answer_id'yi al

    const answer = await Answer.findById(answerId) //answer_id'ye göre answer'ı bul

    if (answer.user != userId) { //user'ın id'si answer'ın user'ının id'sine eşit değilse
        return next(new CustomError("Only owner can handle this operation", 403))
    } //user'ın id'si answer'ın user'ının id'sine eşit değilse hata döndür

    next(); //eşitse devam et
});


module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}