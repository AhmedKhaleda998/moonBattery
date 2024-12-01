const router = require('express').Router();

const { register, ping, configure } = require('../controllers/battery');

const { validateMacAddress, validateConfigurations, existingBattery } = require('../validations/battery');

const { validationError } = require('../middlewares/validationError');

const { authorize } = require('../middlewares/authorization');

router.post('/register', validateMacAddress(), existingBattery(false), validationError, register);

router.post('/ping', validateMacAddress(), existingBattery(true), validationError, authorize, ping);

router.put('/configurations', validateMacAddress(), validateConfigurations(), existingBattery(true), validationError, authorize, configure);

module.exports = router;