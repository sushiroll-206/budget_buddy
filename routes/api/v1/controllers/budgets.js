import express from 'express';
var router = express.Router();


// GET actual and projected budget for user
router.get('/actual', async (req, res) => {
  let username = req.query.username;
  try {
    let allActual = await req.models.ActualBudget.find({username: username});
    let actualBudget = await Promise.all(
      allActual.map(async actual => {
        try {
          let {username, type, amount, description} = actual;
          return {username, type, amount, description};
        }
        catch(error) {
          console.log("Error: ", error);
          return {type, error};
        }
      })
    );
    res.send(actualBudget);
  }
  catch(error) {
    console.log("Error: ", error);
    res.status(500).json({status: "error", error: error});
  }
});

// GET projected budget for user
router.get('/projected', async (req, res) => {
  let username = req.query.username;
  try {
    let allProjected = await req.models.ProjectedBudget.find({username: username});
    let projectedBudget = await Promise.all(
      allProjected.map(async projected => {
        try {
          let {username, type, amount, description} = projected;
          return {username, type, amount, description};
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

// POST budget for user
router.post('/', async (req, res) => {
  try {
    if(req.session.isAuthenticated) {
      let budgetType = req.body.budgetType;
      if (budgetType) {
        const newProjected = new req.models.ProjectedBudget({
            username: req.session.account.username,
            type: req.body.type, // income or expense
            category: req.body.category,  // income/expense category
            amount: req.body.amount,
            description: req.body.description,// description of income/expense
            created_date: new Date()
        });
        await newProjected.save();
      }
      else {
        const newActual = new req.models.ActualBudget({
          username: req.session.account.username,
          type: req.body.type, 
          amount: req.body.amount,
          category: req.body.category,
          description: req.body.description,
          created_date: new Date()
        });
        await newActual.save();
      }

      res.json({status: "success"});
    }
  }
  catch(error) {
    console.log("error: ", err);
    res.status(500).json({status: "error", error: error});
  }
});

export default router;

