import express from 'express';
var router = express.Router();


// GET actual and projected budget for user
router.get('/', async (req, res) => {

  let username = req.query.username;

  try {
    let allActual = await req.models.ActualBudget.find({username: username});
    let actualBudget = await Promise.all(
      allActual.map(async actual => {
        try {
          let {username, type, amount, post, description} = actual;
          return {username, type, amount, post, description};
        }
        catch(error) {
          console.log("Error: ", error);
          return {type, error};
        }
      })
    );
    res.send(actualBudget);
    
    let allProjected = await req.models.ProjectedBudget.find({username: username});
    let projectedBudget = await Promise.all(
      allProjected.map(async projected => {
        try {
          let {username, type, amount, post, description} = projected;
          return {username, type, amount, post, description};
        }
        catch(error) {
          console.log("Error: ", error);
          return {type, error};
        }
      })
    );
    res.send(projectedBudget);
  }
  catch(error) {
    console.log("Error: ", error);
    res.status(500).json({status: "error", error: error});
  }
});

// POST actual budget for user
router.post('/actual', async (req, res) => {
  try {
    if(req.session.isAuthenticated) {
      const newActual = new req.models.ActualBudget({
        username: req.session.account.username,
        type: req.body.type, 
        amount: req.body.amount,
        post: req.body.postID,
        description: req.body.description
      });
      await newActual.save();

      res.json({status: "success"});
    }
  }
  catch(error) {
    console.log("error: ", err);
    res.status(500).json({status: "error", error: error});
  }
});

// POST projected budget for user
router.post('/projected', async (req, res) => {
  try {
    if(req.session.isAuthenticated) {
      const newProjected = new req.models.ProjectedBudget({
        username: req.session.account.username,
        type: req.body.type, 
        amount: req.body.amount,
        post: req.body.postID,
        description: req.body.description
      });
      await newProjected.save();

      res.json({status: "success"});
    }
  }
  catch(error) {
    console.log("error: ", err);
    res.status(500).json({status: "error", error: error});
  }
});

export default router;