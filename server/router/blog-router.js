const express = require("express");
const router = express.Router();
const {createBlog, getAllBlogs,deleteBlog} = require("../controllers/blog-controllers");

router.route("/create").post(createBlog);
router.route("/get-blogs").get(getAllBlogs);

module.exports = router;