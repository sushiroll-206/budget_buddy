import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  res.send('respond with a resource');
});

router.get('/projected', async (req, res) => {
  try {
    const { postId } = req.params;
    const budgets = await ProjectedBudget.find({ postId });
    res.json(budgets);
  } catch (error) {
    res.status(500).send('Server error');
  }
})

export default router;
