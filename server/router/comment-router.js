const express = require("express");
const router = express.Router();
const {addComment, getComments} = require("../controllers/comment-controller")

router.route("/:blogid").post(addComment);
router.route("/get/:blogid").get(getComments);

module.exports = router