// modules/users/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');


router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/profile', userController.getProfile);

router.get('/', userController.getAllUsers);

module.exports = router;