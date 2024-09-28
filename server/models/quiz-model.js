const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
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

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz