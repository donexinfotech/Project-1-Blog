const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    question :{
        type : String,
        require: true
    },
    options: {
        type: [String],
        required: true
    },
    correct_answer: {
        type: String,
        required: true
    }
});

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    quiz : [questionSchema]
})

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz