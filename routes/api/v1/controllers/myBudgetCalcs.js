import express from 'express';
var router = express.Router();

// get all instances of projected income and expense from user
router.get('/projectedIncome', async (req, res) => {
  
    try {
        if (req.session.isAuthenticated) {
            let username = req.session.account.username;
            let projectedIncome = await req.models.ProjectedBudget.aggregate([{ $match : { $and: [ { username : username }, { type: "Income" } ] } }]);
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
            let projectedExpense = await req.models.ProjectedBudget.aggregate([{ $match : { $and: [ { username : username }, { type: "Expense" } ] } }]);
            let allExpense = await Promise.all(
              projectedExpense.map(async expense => {
                try {
                  let {username, type, amount, description, category} = expense;
                  return {username, type, amount, description, category};
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

// get all instances of actual income and expense from user
router.get('/actualIncome', async (req, res) => {
  
  try {
      if (req.session.isAuthenticated) {
          let username = req.session.account.username;
          let actualIncome = await req.models.ActualBudget.aggregate([{ $match : { $and: [ { username : username }, { type: "Income" } ] } }]);
          let allIncome = await Promise.all(
            actualIncome.map(async income => {
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

router.get('/actualExpense', async (req, res) => {

  try {
      if (req.session.isAuthenticated) {
          let username = req.session.account.username;
          let actualExpense = await req.models.ActualBudget.aggregate([{ $match : { $and: [ { username : username }, { type: "Expense" } ] } }]);
          let allExpense = await Promise.all(
            actualExpense.map(async expense => {
              try {
                let {username, type, amount, description, category} = expense;
                return {username, type, amount, description, category};
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

router.get('/highest', async (req, res) => {
  if (req.session.isAuthenticated) {
    let username = req.session.account.username;
    let maxExpense = await req.models.ActualBudget.aggregate([{ $match : { $and: [ { username : username }, { type: "Expense" } ] } }, { $group : { _id : "$category", maxAmount : { $max : "$amount"}}}]);
    console.log("This is the maxExpense" + JSON.stringify(maxExpense));
    let highestExpense = await Promise.all(
      maxExpense.map(async expense => {
        try {
          let {_id, maxAmount} = expense;
          return {_id, maxAmount};
        }
        catch(error) {
          console.log("Error: ", error);
          return {type, error};
        }
      })
    );
    res.send(highestExpense);
  }
});

export default router;