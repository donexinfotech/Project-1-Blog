const express = require("express");
const router = express.Router();
const {Register, Login, getUserById, updateUser} = require("../controllers/auth-controller");

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/get-user-by-id/:id').get(getUserById);
router.route('/update/:id').patch(updateUser);

module.exports = router;