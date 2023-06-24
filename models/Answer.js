const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Question = require('./Question');

const AnswerSchema = new Schema({
    content : {
        type : String,
        required : [true, 'Please provide a content'],
        minlength : [20, 'Please provide a content at least 20 characters']
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User'
    },
    question : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'Question'
    }
});

AnswerSchema.pre("save",async function(next){

    if (!this.isModified("user")) return next();

    try {
        const Question = require('./Question');
        const question = await Question.findById(this.question);

        question.answers.push(this.id);
        question.answerCount = question.answers.length;
        await question.save();
        next();
    }
    catch(err) {
        next(err);
    }
 
});

 


module.exports = mongoose.model('Answer', AnswerSchema);