// routes/userRoutes.js
const express = require('express');
const { validation, confirmation, expressSTK, registerUrl } = require('../controllers/mpesa_c2b');
const { withdrawConfirm } = require('../controllers/mpesa_b2c');
const router = express.Router();
// const { withdrawConfirm } = "../controllers/mpesa_b2c"
// Define the registration route

router.get("/registerUrl", registerUrl);

router.post("/express", expressSTK);

router.post("/confirmation", confirmation);

router.post("/validation", validation);

router.post("/withdrawConfirm", withdrawConfirm)

module.exports = router;
