const Bikerack = require(`../models/bikerack`);
const Review = require(`../models/review`);

module.exports.createReview = async (req, res) => {
    const bikerack = await Bikerack.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    bikerack.reviews.push(review);
    await review.save();
    await bikerack.save();
    req.flash('success', 'Created a new review');
    res.redirect(`/bikeracks/${bikerack._id}`);
}

module.exports.deleteReview = async(req,res) => {
    const { id, reviewId } = req.params;
    await Bikerack.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted a review');
    res.redirect(`/bikeracks/${id}`)
}