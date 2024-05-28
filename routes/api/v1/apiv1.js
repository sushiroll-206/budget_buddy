import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import postsRouter from './controllers/posts.js';
import budgetsRouter from './controllers/budgets.js';
import usersCards from './controllers/usersCards.js';
import myBudgetController from './controllers/myBudgetController.js';
import myBudgetCalcsRouter from './controllers/myBudgetCalcs.js';


router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/budgets', budgetsRouter);
router.use('/usersCards', usersCards)
router.use('/myBudget', myBudgetController)
router.use('/myBudgetCalcs', myBudgetCalcsRouter)

export default router;