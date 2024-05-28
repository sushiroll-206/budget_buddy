import express from 'express';
var router = express.Router();

// get all instances of projected income from user
router.get('/projectedIncome', async (req, res) => {
  
    try {
        if (req.session.isAuthenticated) {
            let username = req.session.account.username;
            let projectedIncome = await req.models.ProjectedBudget.aggregate([{ $match : { $and: [ { username : username }, { type: "Income" } ] } }]);
            console.log(projectedIncome)
            let allIncome = await Promise.all(
              projectedIncome.map(async income => {
                try {
                  let {username, type, amount, description, category} = income;
                  return {username, type, amount, description, category};
                }
                catch(error) {
                  console.log("Error: ", error);
                  return {type, error};
                }
              })
            );
            res.send(allIncome);
        }
    }
    catch(error) {
      console.log("Error: ", error);
      res.status(500).json({status: "error", error: error});
    }
});

router.get('/projectedExpense', async (req, res) => {
  
    try {
        if (req.session.isAuthenticated) {
            let username = req.session.account.username;
            let projectedExpense = await req.models.ProjectedBudget.find({username: username}).aggregate([{ $match : { type : "expense" } }]);
            console.log(projectedExpense)
            let allExpense = await Promise.all(
              allExpense.map(async expense => {
                try {
                  let {username, type, amount, description} = expense;
                  return {username, type, amount, description};
                }
                catch(error) {
                  console.log("Error: ", error);
                  return {type, error};
                }
              })
            );
            res.send(allExpense);
        }
    }
    catch(error) {
      console.log("Error: ", error);
      res.status(500).json({status: "error", error: error});
    }
});

export default router;