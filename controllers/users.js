const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register') }

module.exports.register = async(req,res) => {
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username})
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next (err)
        req.flash('success', 'Welcome to Toronto Bike Racks')
        res.redirect('/bikeracks')
    })}
    catch(e)
    {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login')
}

module.exports.login = (req,res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/bikeracks'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res) => {
    //logout now async so need to catch error? Not clear on this - https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
    req.logout(function(err) {
        if (err) { return next(err);  }})
    req.flash('success', "You're logged out, Goodbye!")
    res.redirect('/bikeracks')
}