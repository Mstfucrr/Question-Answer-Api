const express = require('express');
const router = express.Router();
const { askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, undoLikeQuestion } = require('../controllers/question')
const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/auth')
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelpers')
const answer = require('./answer')
const Question = require('../models/Question')
const { questionQueryMiddleware } = require('../middlewares/query/questionQueryMiddleware.js')
const { answerQueryMiddleware } = require('../middlewares/query/answerQueryMiddleware');


router.get('/',
    questionQueryMiddleware(Question, {
        population: {
            path: 'user',
            select: 'name profile_image'
        }
    }), getAllQuestions)
router.get('/:id', checkQuestionExist, answerQueryMiddleware(Question,{
    population: [
        {
            path: 'user',
            select: 'name profile_image'
        },
        {
            path: 'answers',
            select: 'content user'
        }
    ]
}), getSingleQuestion)

// add, edit and delete question
router.post('/ask', getAccessToRoute, askNewQuestion)
router.put('/:id/edit', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion)
router.delete('/:id/delete', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion)
// like and undo like question
router.get('/:id/like', [getAccessToRoute, checkQuestionExist], likeQuestion)
router.get('/:id/undo_like', [getAccessToRoute, checkQuestionExist], undoLikeQuestion)

// add answer to question
router.use('/:question_id/answers', checkQuestionExist, answer)


module.exports = router