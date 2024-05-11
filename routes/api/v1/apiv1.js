import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import postsRouter from './controllers/posts.js';
import budgetsRouter from './controllers/budgets.js';

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/budgets', budgetsRouter);

export default router;