const express = require('express');
const router = express.Router();
const {
    createReview,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReview); 

router.route('/:id')
    .put(protect, updateReview) 
    .delete(protect, deleteReview);

module.exports = router;