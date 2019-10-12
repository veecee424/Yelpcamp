let express = require("express");
let router = express.Router();
let User = require("../Models/user");
let passport = require("passport");

 //Register
 router.get("/register", function(req, res) {
    res.render("register.ejs");
 });

 router.post("/register", function(req, res) {
     let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, registeredUser) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            //passport.authenticate("local")(req, res, function(){ ...... logs the user in automatically on sign up
            User.authenticate("local")(req, res, function(){
               req.flash("success", registeredUser.username + ", your're Successfully registered!")
              res.redirect("/login");;
            });
        }
    });
 });

 //Login Route
 router.get("/login", function(req, res) {
    res.render("login.ejs");
 });

 router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "login"
 }), function(req, res) {
     req.flash("success", "successfully logged in!");
 });

 //Logout Route
 router.get("/logout", function(req, res) {
    req.logOut();
    req.flash("success", "Successfully logged out"); //When the logout route is created, this is created as a key(success)/value(successfully logged out) pair; and this would be available for use in the login.ejs file/login page
    res.redirect("/login");
});

module.exports = router;