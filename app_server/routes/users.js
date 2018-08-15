var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/users')

router.get('/', ctrlUsers.users);

module.exports = router;
