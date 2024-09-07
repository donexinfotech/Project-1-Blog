const express = require("express");
const router = express.Router();
const {createBlog, getAllBlogs,deleteBlog, updateBlog, getBlogById} = require("../controllers/blog-controllers");
const auth_middleware = require("../middleware/auth-middleware");

router.route("/create").post(auth_middleware,createBlog);
router.route("/get-blogs").get(getAllBlogs);
router.route("/:id").delete(deleteBlog);
router.route("/update-blog/:id").patch(updateBlog);
router.route("/get-blog-by-id/:id").get(getBlogById);

module.exports = router;