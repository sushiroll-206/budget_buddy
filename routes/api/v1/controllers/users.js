import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/myIdentity', function(req, res, next) {
  if(req.session.isAuthenticated){
    res.json({
        status: "loggedin",
        user: {name: req.session.account.name,
               username: req.session.account.username,
               email: req.body.email}
    }); 

  } else{
    res.json({status: "loggedout"});
  }
});
  


export default router;