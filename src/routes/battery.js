const router = require('express').Router();

const { register, ping, configure } = require('../controllers/battery');

const { validateMacAddress, validateConfigurations, existingBattery } = require('../validations/battery');

router.post('/register', validateMacAddress(), existingBattery(false), register);

router.post('/ping', validateMacAddress(), existingBattery(true), ping);

router.post('/configurations', validateMacAddress(), validateConfigurations(), existingBattery(true), configure);

module.exports = router;