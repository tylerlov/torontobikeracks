const express = require(`express`);
const router = express.Router();
const catchAsync = require(`../utils/catchAsync`);
const Bikerack = require(`../models/bikerack`);
const { isLoggedIn, isAuthor, validateBikerack } = require('../middleware')
const { bikerackSchema } = require(`../schemas`);

const bikeracks = require('../controllers/bikeracks');
const { storage } = require('../cloudinary');

const multer  = require('multer')
const upload = multer( { storage } )

router.route('/')
    .get(catchAsync (bikeracks.index))
    .post(isLoggedIn, upload.array('image'), validateBikerack, catchAsync( bikeracks.createBikerack ))

router.get(`/new`, isLoggedIn, bikeracks.renderNewForm)

router.route('/:id')
    .get(catchAsync ( bikeracks.showBikerack ))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBikerack, catchAsync ( bikeracks.updateBikerack ))
    .delete(isLoggedIn, isAuthor, catchAsync ( bikeracks.deleteBikerack ))

router.get(`/:id/edit`, isLoggedIn, isAuthor, catchAsync ( bikeracks.renderEditForm ))

module.exports = router;