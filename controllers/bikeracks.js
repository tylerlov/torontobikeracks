const Bikerack = require(`../models/bikerack`);
const { cloudinary } = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req,res) => {
    const bikeracks = await Bikerack.find({});
    res.render(`bikeracks/index`, {bikeracks});
}

module.exports.renderNewForm = (req,res) => {
    res.render(`bikeracks/new`);
}

module.exports.createBikerack= async(req,res,next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.bikerack.location,
        limit: 1
    }).send()
    const bikerack = new Bikerack(req.body.bikerack);
    bikerack.geometry = geoData.body.features[0].geometry
    bikerack.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    bikerack.author = req.user._id;
    await bikerack.save();
    req.flash(`success`,`Successfully added a new Bike Rack`)
    res.redirect(`bikeracks/${bikerack._id}`);
}

module.exports.showBikerack = async (req,res) => {
    const bikerack = await Bikerack.findById(req.params.id).populate({ path:`reviews`, populate: { path: 'author' }
    }).populate('author');
    //Keep in mind, this would not necessarily scale. It would be smarter on a larger app to limit number of reviews at any given point
    res.render(`bikeracks/show`, { bikerack });
}

module.exports.renderEditForm = async (req,res) => {
    const { id } = req.params;
    const bikerack = await Bikerack.findById(id)
    res.render(`bikeracks/edit`, { bikerack });
}

module.exports.updateBikerack= async(req,res) => {
    const { id } = req.params;
    const bikerack = await Bikerack.findById(id);
    if (!bikerack){
        req.flash('error', 'Cannot find that Bike Rack')
        return res.redirect('/bikeracks')
    }
    const biker = await Bikerack.findByIdAndUpdate(id,{...req.body.bikerack}, {new: true})
    // req.files.map retruns an array of arrays here, so we need to spread that out since image is expect and array of strings (name, url)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    biker.images.push(...imgs)
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages ) {
            cloudinary.uploader.destroy(filename)
        }
        await biker.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages }}}})
    }

    biker.save()

    req.flash('success', 'Successfully updated the Bike Rack')
    res.redirect(`/bikeracks/${bikerack._id}`);
}

module.exports.deleteBikerack = async(req,res) => {
    const {id} = req.params;
    await Bikerack.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Bike Rack')
    res.redirect(`/bikeracks`);
}