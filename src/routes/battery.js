const router = require('express').Router();

const { register, ping, configure } = require('../controllers/battery');

const { validateMacAddress, validateConfigurations, existingBattery } = require('../validations/battery');

const { authorize } = require('../middlewares/authorization');

router.post('/register', validateMacAddress(), existingBattery(false), register);

router.post('/ping', validateMacAddress(), existingBattery(true), authorize, ping);

router.post('/configurations', validateMacAddress(), validateConfigurations(), existingBattery(true), authorize, configure);

module.exports = router;