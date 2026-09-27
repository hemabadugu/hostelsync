const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getReceipt } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/receipt/:paymentId', getReceipt);

module.exports = router;
