import express from 'express';
var router = express.Router();

router.get('/', async(req, res) => {
    try {
        let postID = req.query.postID;
        let postComments = await req.models.Comment.find({post: postID});
        res.json(postComments);
    }
    catch(err) {
        console.log("error: ", err);
        res.status(500).json({status: "error", error: err});
    }
});

router.post('/', async(req, res) => {
    try {
        if (req.session.isAuthenticated) {
            const newComment = new req.models.Comment({
                username: req.session.account.username,
                comment: req.body.newComment,
                post: req.body.postID,
                created_date: new Date()
            });

            await newComment.save();
    
            res.json({status: "success"});
        }
    }
    catch(err) {
        console.log("error: ", err);
        res.status(500).json({status: "error", error: err});
    }
});


export default router;