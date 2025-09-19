const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/generate', controller.generateQR);
router.post('/send-email', controller.sendEmailWithGmail);

module.exports = router;
