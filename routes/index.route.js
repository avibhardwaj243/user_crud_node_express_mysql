const express = require('express');
const router = express.Router();

//Require the Controller

const index_controller = require('../controllers/index.controller');

router.get('/', index_controller.index);

module.exports = router;
