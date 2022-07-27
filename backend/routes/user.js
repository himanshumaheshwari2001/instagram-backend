const express= require("express")
const {  register, login, logout, followUser, getpostoffollowing, updatePassword } = require("../controller/user")
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router()


router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)

router.route("/follow/:id").get(isAuthenticated,followUser)
router.route("/follower/post").get(isAuthenticated,getpostoffollowing)
router.route("/update/password").put(isAuthenticated,updatePassword)

module.exports = router;