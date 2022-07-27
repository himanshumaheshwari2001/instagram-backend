const User = require("../models/user");
const Post = require("../models/post")
const catchAsyncError = require("../middlewares/catchAsyncError")
const ErrorHandler = require("../utils/errorhandler")
exports.register = catchAsyncError(async(req,res,next)=>{

    const{name,email,password} = req.body
    let user = await User.findOne({email})
if (user) {
    return res.status(400).json({
success:false,
message:"user already exist"

    })
}
    
user = await User.create({
    name,
    email,
    password,
    avatar:{public_id:"sample id",url:"sample url"}

})
//generating token
const token = await user.generateToken();

//options for token in cookies
const options ={expires:new Date(Date.now()+90*24*60*60*1000),httpOnly:true}


//login success and saving jwt in cookie
res.status(201).cookie("token",token,options).json({success:true,token})



})



exports.login = catchAsyncError(async(req,res,next)=>{


    const{email,password}= req.body;

    const user = await User.findOne({email}).select("+password")
console.log(user);
if (!user) {
    return res.status(400).json({
success:false,
message:"user does not exist"

    })
}

const isMatch = await user.matchPassword(password);

//checking for bcrypt password
if (!isMatch) {
    return res.status(400).json({success:false,message:"incorrect password"})
}

//generating token
const token = await user.generateToken();

//options for token in cookies
const options ={expires:new Date(Date.now()+90*24*60*60*1000),httpOnly:true}


//login success and saving jwt in cookie
res.status(200).cookie("token",token,options).json({success:true,token})





})


//logout user 

exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {

        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({

        success: true,
        message: "logged out successfully"
    })
})

//follow user

exports.followUser = catchAsyncError(async(req,res)=>{
    const usertofollow = await User.findById(req.params.id)

    const loggedinuser = await User.findById(req.user._id)
    
    if (!usertofollow) {
    res.status(404).json({success:false,message:"user not found"})
}

if (loggedinuser.following.includes(usertofollow._id)) {
   
const indexfollowing = loggedinuser.following.indexOf(usertofollow._id)
const indexfollowers = usertofollow.followers.indexOf(loggedinuser._id)


loggedinuser.following.splice(indexfollowing,1)
usertofollow.followers.splice(indexfollowers,1)

await loggedinuser.save()
await usertofollow.save()
res.status(200).json({
    success:true,
    message:"user unfollowed"
    })
}

else{

    loggedinuser.following.push(req.params.id)
usertofollow.followers.push(req.user._id)

await loggedinuser.save()
await usertofollow.save()

res.status(200).json({
success:true,
message:"user followed"
})
}
})


exports.getpostoffollowing = catchAsyncError(async(req,res,next)=>{

const user = await User.findById(req.user._id)

const post = await Post.find({

    owner:{
        $in:user.following,
    }
})

res.status(200).json({

success:true,
post
})
})

//update password

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
  
    const user = await User.findById(req.user.id).select("+password")
 console.log(user);

    const isPasswordMatched = await user.matchPassword(req.body.oldPassword)
console.log(isPasswordMatched);
    if (!isPasswordMatched) {

        return next(new ErrorHandler("old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {

        return next(new ErrorHandler("password does not match with confirm password", 400))
    }

    user.password = req.body.newPassword
await user.save()

// res.status(200)({

//     success:true,
//     message:"Password updated successfully"
// })


})