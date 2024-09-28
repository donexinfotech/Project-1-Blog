const express = require("express");
const { addQuiz,answerQuestions, answerQuiz, getAllQuiz, getQuizById } = require("../controllers/quiz-controller");
const auth_middleware = require("../middleware/auth-middleware");
const router = express.Router();

router.route('/').get(getAllQuiz)
router.route('/:id').get(getQuizById)
router.route('/add').post(addQuiz)
router.route('/answer/:quizid/:questionid').post(auth_middleware, answerQuestions)
router.route('/answer/:quizid').get(auth_middleware, answerQuiz)

module.exports = router