const express = require("express");
const router = express.Router();
const {createBlog, getAllBlogs,deleteBlog, updateBlog, getBlogById, getBlogByUserId, getBlogByCategory} = require("../controllers/blog-controllers");
const auth_middleware = require("../middleware/auth-middleware");

router.route("/create").post(auth_middleware,createBlog);
router.route("/get-blogs").get(getAllBlogs);
router.route("/:id").delete(deleteBlog);
router.route("/update-blog/:id").patch(updateBlog);
router.route("/get-blog-by-id/:id").get(getBlogById);
router.route("/get-blog-by-userid/:id").get(getBlogByUserId);
router.route("/get-blog-by-category/:category").get(getBlogByCategory);

module.exports = router;