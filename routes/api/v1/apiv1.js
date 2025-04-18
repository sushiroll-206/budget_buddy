import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import budgetsRouter from './controllers/budgets.js';
import usersCards from './controllers/usersCards.js';
import myBudgetController from './controllers/myBudgetController.js';
import myBudgetCalcsRouter from './controllers/myBudgetCalcs.js';
import commentsRouter from './controllers/comments.js';
import authRouter from './controllers/auth.js';


router.use('/users', usersRouter);
router.use('/budgets', budgetsRouter);
router.use('/usersCards', usersCards)
router.use('/myBudget', myBudgetController)
router.use('/myBudgetCalcs', myBudgetCalcsRouter)
router.use('/comments', commentsRouter)
router.use('/auth', authRouter)

export default router;