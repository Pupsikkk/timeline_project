const Router = require('express');
const router = new Router();
const dataRouter = require('./dataRouter');
const userRouter = require('./userRouter');

router.use('/data', dataRouter);
router.use('/user', userRouter);

module.exports = router;
