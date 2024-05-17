import express from 'express';

var router = express.Router();

// import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async(req, res) => {
    try {
        if(req.session.isAuthenticated) {
            const newPost = new req.models.Post({
                username: req.session.account.username,
                description: req.body.description,
                likes: req.body.likes,
                created_date: new Date()
            });
    
            await newPost.save();
    
            console.log("Date posted: " + req.body.created_date);

            res.json({status: "success"});
        }
        else {
            res.status(401).json({status: "error", error: "not logged in"});
        }
    }
    catch(err) {
        console.log("Error connecting to db", err);
        res.status(500).json({"status": "error", "error": err});
    }
});

router.get('/', async function(req, res) {

    let username = req.query.username;

    try{
        let allPosts = await req.models.Post.find();
        if (username) {
            allPosts = await req.models.Post.find({username: username});
        }
      let postData = await Promise.all(
        allPosts.map(async post => {
            try {
                let {username, description, id, likes, created_date} = post;
                let htmlPreview = await getURLPreview(url);
                return {description, username, id, likes, created_date};
            }
            catch(error) {
                console.log("Error:", error);
                return {description, error};
            }
        })
        
      );
      res.send(postData);
    } catch(error){
      console.log("Error:", error);
      res.status(500).json({"status": "error", "error": error});
    }
});

router.post('/like', async(req, res) => {
    try {
        if (req.session.isAuthenticated) {
            let likedID = req.body.postID;
            let likedPost = await req.models.Post.findById(likedID);
            if (!likedPost.likes.includes(req.session.account.username)) {
                likedPost.likes.push(req.session.account.username);
                console.log("This is the likes array after liking: " + likedPost.likes.length);
            }
            await likedPost.save();
            res.json({status: "success"});
        }
        else {
            res.status(401).json({status: "error", error: "not logged in"});
        }
    }
    catch(err) {
        console.log("error: ", err);
        res.status(500).json({status: "error", error: err});
    }
});

router.post('/unlike', async(req, res) => {
    try {
        if (req.session.isAuthenticated) {
            let likedID = req.body.postID;
            let likedPost = await req.models.Post.findById(likedID);
            if (likedPost.likes.includes(req.session.account.username)) {
                let userIndex = likedPost.likes.indexOf(req.session.account.username);
                likedPost.likes.splice(userIndex, 1);
                console.log("This is the likes array after deleting: " + likedPost.likes.length);
            }
            await likedPost.save();
            res.json({status: "success"});
        }
        else {
            res.status(401).json({status: "error", error: "not logged in"});
        }
    }
    catch(err) {
        console.log("error: ", err);
        res.status(500).json({status: "error", error: err});
    }
});

router.delete("/", async(req, res) => {
    try {
        if (req.session.isAuthenticated) {
            let postID = req.body.postID;
            let deletePost = await req.models.Post.findById(postID);
            if (!deletePost.username.includes(req.session.account.username)) {
                res.status(401).json({status: "error", error: "you can only delete your own posts"});
            }
            await req.models.Comment.deleteMany({post: postID});
            await req.models.Post.deleteOne({_id: postID});
            res.json({status: "success"});
        }
        else {
            res.status(401).json({status: "error", error: "not logged in"});
        }
    }
    catch(err) {
        console.log("error: ", err);
        res.status(500).json({status: "error", error: err});
    }
});

export default router;