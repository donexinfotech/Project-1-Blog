const express = require("express");
const router = express.Router();
const {createBlog, getAllBlogs,deleteBlog, updateBlog} = require("../controllers/blog-controllers");

router.route("/create").post(createBlog);
router.route("/get-blogs").get(getAllBlogs);
router.route("/:id").delete(deleteBlog);
router.route("/update-blog/:id").patch(updateBlog);

module.exports = router;