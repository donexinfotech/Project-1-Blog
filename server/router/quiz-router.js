const express = require("express");
const { addQuiz, answerQuiz, getAllQuiz } = require("../controllers/quiz-controller");
const auth_middleware = require("../middleware/auth-middleware");
const router = express.Router();

router.route('/').get(getAllQuiz)
router.route('/add').post(addQuiz)
router.route('/answer/:id').post(auth_middleware, answerQuiz)

module.exports = router