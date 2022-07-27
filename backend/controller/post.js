const Post = require("../models/post")
const User = require("../models/user")

exports.createPost = async(req,res)=>{

try {
    
const newPostData = {

    caption:req.body.caption,
    image:{

        public_id:"req.body.public_id",
        url:"req.body.url"
    },
    owner:req.user._id
}
const post = await Post.create(newPostData)
const user = await User.findById(req.user._id)

user.posts.push(post._id)

await user.save()

res.status(201).json({
success:true,
post,

})

} catch (error) {
    res.status(500).json({

        success:false,
        message:error.message
    })
}

}

exports.deletePost = async(req,res)=>{

const post = await Post.findById(req.params.id)

if (!post) {
    return res.status(404).json({messge:"post not found"})
}
if (post.owner.toString() != req.user._id.toString()) {
  
    return res.status(401).json({success:false,messge:"unauthorized"})  
}

await post.remove()

const user = await User.findById(req.user._id)

const index =await user.posts.indexOf(req.params.id)

user.posts.splice(index,1)
await user.save()

return res.status(200).json({messge:"poat deleted successfully"})

}


exports.likeAndUnlike = async (req,res,next) =>{

try {
    
const post = await Post.findById(req.params.id)

if (!post) {
    return res.status(404).json({message:"Post not found"})
}
console.log(req.params.id);
console.log(req.user._id);
console.log(req.user.id);
if (post.likes.includes(req.user._id)) {
    
    const index = post.likes.indexOf(req.user.id)

    post.likes.splice(index,1)

    await post.save();
return res.status(200).json({success:true,message:"Unlike post"})

} else {
    post.likes.push(req.user.id)

    await post.save()
    return res.status(200).json({success:true,message:"liked post"})
}



} catch (error) {
    res.status(500).json({

        success:false,
        message:error.message
    })
}


}
