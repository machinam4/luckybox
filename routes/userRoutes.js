// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const PlayerController = require('../controllers/PlayerController');
// Define the registration route

router.post('/getOTP', AuthController.generateOTP);
router.post('/verifyOTP', AuthController.confirmOTP);


router.post('/registerPlayer', PlayerController.registerPlayer);
router.post('/loginPlayer', PlayerController.loginPlayer);
router.post('/handleMOSms', PlayerController.handleMOSms);
router.post('/playerBet', PlayerController.playerBet);
 
router.post('/registerUser', UserController.registerUser);

module.exports = router;
