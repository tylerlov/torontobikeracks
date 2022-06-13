const express = require(`express`);
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews')

const catchAsync = require(`../utils/catchAsync`);
const ExpressError = require(`../utils/ExpressError`);
const Campground = require(`../models/campground`);
const Review = require(`../models/review`);
const { reviewSchema } = require(`../schemas`)

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../models/review');

router.post(`/`, isLoggedIn, validateReview, catchAsync( reviews.createReviews ))

router.delete(`/:reviewId`, isLoggedIn, isReviewAuthor, catchAsync( reviews.deleteReview ))

module.exports = router;