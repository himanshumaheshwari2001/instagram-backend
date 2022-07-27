const express = require("express");
const { createPost, likeAndUnlike, deletePost } = require("../controller/post");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();



router.route("/post/upload").post(isAuthenticated,createPost)

router.route("/post/:id").get(isAuthenticated,likeAndUnlike).delete(isAuthenticated,deletePost)






module.exports = router;