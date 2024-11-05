const express = require("express");
const router = express.Router();
const {Register, Login, getUserById, updateUser, passwordReset, sendResetMail, confirmRegister} = require("../controllers/auth-controller");

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/get-user-by-id/:id').get(getUserById);
router.route('/update/:id').patch(updateUser);
router.route('/send-reset-mail').post(sendResetMail);
router.route('/password-reset/:email').post(passwordReset);
router.route('/confirm-register').post(confirmRegister);

module.exports = router;