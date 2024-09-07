const express = require("express");
const router = express.Router();
const {Register, Login, getUserById} = require("../controllers/auth-controller");

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/get-user-by-id/:id').get(getUserById);

module.exports = router;