//require express
let express                 = require("express"),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    User                    = require("./Models/user.js"),
    ExpressSession          = require("express-session"),
    passport                = require("passport"),
    flash                   = require("connect-flash"),
    methodOverride          = require("method-override"),
    LocalStrategy           = require("passport-local");

//connect to DB
mongoose.connect(process.env.DB || "mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true, useUnifiedTopology: true});


//Dependencies uses
let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(ExpressSession({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false,
   // store: new MemoryStore()
}));
//app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Declare a variable to be used across all frontend files (in views directory)
app.use(function(req, res, next) {
    res.locals.CurrentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    next();
});

let CampgroundRoutes = require("./routes/campgroundsRoute");
let authenticationRoutes = require("./routes/authRoute");
let commentsRoutes = require("./routes/commentsRoute");

app.use(CampgroundRoutes);
app.use(authenticationRoutes);
app.use(commentsRoutes);

app.listen(process.env.PORT || 5000, function () {
console.log("Yelcamp Server is running");
});


module.exports = app;

