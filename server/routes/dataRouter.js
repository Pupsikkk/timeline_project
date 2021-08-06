const Router = require('express');
const router = new Router();
const path = require('path');
const DataController = require(path.resolve('controllers', 'DataController'));
const AuthMiddleware = require(path.resolve('middleware', 'authHandler'));

router.get(
  '/getTypesAndSubtypes',
  AuthMiddleware,
  DataController.getTypesAndSubtypes
);

router.get('/instance', AuthMiddleware, DataController.getInstances);
router.post('/instance', AuthMiddleware, DataController.createInstance);
router.put('/instance', DataController.updateInstance);
router.delete('/instance', DataController.deleteInstance);

router.post(
  '/getFilteredData',
  AuthMiddleware,
  DataController.getFilteredInstances
);
router.post('/saveFilter', AuthMiddleware, DataController.saveFilter);
router.post('/changeImg', AuthMiddleware, DataController.changeImg);

module.exports = router;
