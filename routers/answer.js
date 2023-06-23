const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams: true ile question_id'yi answer.js'e taşıyoruz. Böylece answer.js'de question_id'yi kullanabiliyoruz
const { getAccessToRoute, getAnswerOwnerAccess } = require('../middlewares/authorization/auth'); 
const { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, undoLikeAnswer } = require('../controllers/answer');
const { checkQuestionExist,checkQuestionAndAnswerExist } = require('../middlewares/database/databaseErrorHelpers');

router.post('/', [getAccessToRoute], addNewAnswerToQuestion);
router.get('/', getAllAnswersByQuestion);
router.get('/:answer_id', checkQuestionAndAnswerExist, getSingleAnswer);
router.put('/:answer_id/edit', [getAccessToRoute, checkQuestionAndAnswerExist,getAnswerOwnerAccess], editAnswer);
router.delete('/:answer_id/delete', [getAccessToRoute, checkQuestionAndAnswerExist,getAnswerOwnerAccess], deleteAnswer);
router.get('/:answer_id/like', [getAccessToRoute, checkQuestionAndAnswerExist], likeAnswer);
router.get('/:answer_id/undo_like', [getAccessToRoute, checkQuestionAndAnswerExist], undoLikeAnswer);

module.exports = router;
