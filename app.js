if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require(`express`) 
const ejsMate = require(`ejs-mate`)
const path = require(`path`);
const mongoose = require (`mongoose`);
const ExpressError = require(`./utils/ExpressError`);
const methodoverride = require (`method-override`);
const session = require(`express-session`)
const flash = require(`connect-flash`)
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')


const res = require("express/lib/response");

const campgroundRoutes = require(`./routes/campgrounds`);
const reviewRoutes = require(`./routes/reviews`);
const userRoutes = require('./routes/users')

mongoose.connect(`mongodb://localhost:27017/yelp-camp`, {
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine(`ejs`, ejsMate)
app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname,`views`))

app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({ extended: true}))
app.use(methodoverride(`_method`));


const sessionConfig = {
    secret: `thiscouldbebetter`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // This is in milliseconds 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This allows us global access to the below
//Flash messages and current logged in user from Passport implementation
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash(`success`);
    res.locals.error = req.flash(`error`);
    next();
})


//routes code
app.use('/', userRoutes)
app.use(`/campgrounds`, campgroundRoutes)
app.use(`/campgrounds/:id/reviews`, reviewRoutes)

app.get(`/`, (req,res) => {
    res.redirect(`/campgrounds`)
})

app.all(`*`, (req,res,next) => {
    next(new ExpressError(`Page Not Found`), 404)})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = `Oh no, default error message something went wrong and we dont have the specifics`
    res.status(statusCode).render(`error`, { err })
})

app.listen(3000, () => {
    console.log(`Serving on port 3000`)
})