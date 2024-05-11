import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  res.send('respond with a resource');
});

export default router;