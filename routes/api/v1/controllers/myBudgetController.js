import express from 'express';

var router = express.Router();

router.get("/", async (req, res) => {
    try {
        const requestedUsername = req.query.username;

        const filter = requestedUsername ? { username: requestedUsername } : {};

        let userProjectedBudget = await req.models.ProjectedBudget.find(filter);
        let userActualBudget = await req.models.ActualBudget.find(filter);

        let budgets = {
            actualBudgets: userActualBudget,
            projectedBudgets: userProjectedBudget            
        };

        res.json(budgets);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ "status": "error", "error": error.toString() });
    }
});

router.post("/", async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({
                status: "Error",
                error: "Not Logged In"
            });
        }

        const username = req.session.account.username;
        const  {favoriteBodyWater }= req.body;

        const newUserInfo = await req.models.UsersInfo.findOneAndUpdate(
            { username: username },
            { $set: { favoriteBodyWater: favoriteBodyWater } },
            { new: true, upsert: true }
        );

        await newUserInfo.save()
        res.json({ "status": "success"});

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ "status": "error", "error": error });
    }
});

export default router;