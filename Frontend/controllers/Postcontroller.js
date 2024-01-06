import {Post} from "../models/postModel.js";
import User from "../models/Usermodel.js";
import { v2 as cloudinary } from "cloudinary";

const createpost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getpost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)

        if (!post){
            return res.status(404).json({message:"post not found "})

        }

        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({message:'error in get post '})
    }
}

const deletepost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        console.log(post)
        if(!post){
            return res.status(404).json({message:"post not found"})
        }

        if(post.postedBy.toString()!== req.user._id.toString()){
            return res.status(401).json({message:"unauthorised to delete post "})
        }
        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imgId);

        }

        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:'post deleted succefullly'})
        
    } catch (error) {
        res.status(500).json({message:'error in delete post '})
    }


}

const likeunlike = async (req,res)=>{
    try {
        const {id:postId}=req.params
        console.log(postId)

        const userId= req.user._id
        const post =await Post.findById(postId)
        console.log(post)
        if (!post){
            return res.status(404).json({message:"post not found "})
        }
        const userlikedpost = post.likes.includes(userId)
        if (userlikedpost){
            //unlike
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            return res.status(200).json({mesage:"post unliked successfully"})
        }else{
            post.likes.push(userId)
            await post.save();
            return res.status(200).json({message:"post liked succesfully"})
        }
    } catch (error) {
        res.status(500).json({message:'error in like and unlike  post '})
    }
}

const replytopost= async (req,res)=>{
    try {
        const {text}= req.body;
        const postId= req.params.id.toString()
        const userId= req.user._id.toString()
        const userProfilePic = req.user.profilePic
        const username = req.user.username

        if (!text){
            return res.status(400).json({message:"text feild is required"})
        }
        const  post = await Post.findById(postId)
        if (!post){
            return res.status(404).json({message:"post not found"})
            
        }
        
        const reply= {userId,text,userProfilePic,username}
        await post.replies.push(reply);

        await post.save();
         res.status (200).json({message:"reply sent succesfully",post})



    } catch (error) {
        res.status(500).json({message:'error in replying the post '})
    }
}

const getfeedposts=async (req,res)=>{
    try {
        const userId= req.user._id;
        const user = await User.findById(userId)
        if (!user){
            return res.status(404).json({message:"user not found"})
        }
        const following= user.following;
        const feedPosts= await Post.find({postedBy:{$in:following}}).sort({createdAt:-1});
        return res.status(200).json(feedPosts)
    } catch (error) {
        res.status(500).json({message:'error in getting feed post '})
        
    }
}


const getUserPosts = async (req,res)=>{
const {username}= req.params;
try {
    const user = await User.findOne({username})
    if(!user) {
        return res.status(404).json({error:"user not found "})
    }
    const posts= await Post.find({postedBy:user._id}).sort({createdAt:-1})
    return res.status (200).json(posts)
} catch (error) {
    res.status(500).json({error:error.message})
}

}
export {createpost,getpost,deletepost,likeunlike,replytopost,getfeedposts,getUserPosts}