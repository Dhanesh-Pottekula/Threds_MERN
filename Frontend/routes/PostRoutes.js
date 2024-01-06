import express from "express"
import { createpost, getpost,deletepost,likeunlike,replytopost,getfeedposts,getUserPosts } from "../controllers/Postcontroller.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router()

router
    .get ("/feed",protectRoute,getfeedposts)
    .get ("/:id",getpost)
    .get ("/user/:username",getUserPosts)
    .delete ("/:id",protectRoute,deletepost)
    .post ("/create",protectRoute,createpost)
    .put ("/like/:id",protectRoute,likeunlike)
    .put ("/reply/:id",protectRoute,replytopost)
    

    export default router;