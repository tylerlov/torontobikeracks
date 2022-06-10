const express = require(`express`);
const router = express.Router();
const catchAsync = require(`../utils/catchAsync`);
const Campground = require(`../models/campground`);
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const { campgroundSchema } = require(`../schemas`);


router.get(`/`, catchAsync (async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render(`campgrounds/index`, {campgrounds});
}))

router.get(`/new`, isLoggedIn, (req,res) => {
    res.render(`campgrounds/new`);
})

router.post(`/`, isLoggedIn, validateCampground, catchAsync( async(req,res,next) => {
    // old method, new is above - validateCampground
 //   if(!req.body.campground) throw new ExpressError(`Invalid campground data`, 400)

    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash(`success`,`Successfully made a new Campground!`)
    res.redirect(`campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync ( async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate({ path:`reviews`, populate: { path: 'author' }
    }).populate('author');
    //Keep in mind, this would not necessarily scale. It would be smarter on a larger app to limit number of reviews at any given point
    res.render(`campgrounds/show`, { campground });
}));

router.get(`/:id/edit`, isLoggedIn, isAuthor, catchAsync (async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render(`campgrounds/edit`, { campground });
}))

router.put(`/:id`, isLoggedIn, isAuthor, validateCampground, catchAsync (async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground}, {new: true})
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete(`/:id`, isLoggedIn, isAuthor, catchAsync (async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);

}))

module.exports = router;