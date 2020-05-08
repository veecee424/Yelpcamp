let express = require("express");
let router = express.Router();
let User = require("../Models/user");
let passport = require("passport");


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
          
            User.authenticate("local")(req, res, function(){
               req.flash("success", registeredUser.username + ", your're Successfully registered!")
              res.redirect("/login");
            });
        }
    });
 });


 router.get("/login", function(req, res) {
    res.render("login.ejs");
 });

 router.post("/login", passport.authenticate("local", {
     successFlash: "Successfully logged in!",
    successRedirect: "/campgrounds",
    failureFlash: "Incorrect username and password combination",
    failureRedirect: "login"
 }), function(req, res) {
});


 router.get("/logout", function(req, res) {
    req.logOut();
    req.flash("success", "Successfully logged out"); //When the logout route is created, this is created as a key(success)/value(successfully logged out) pair; and this would be available for use in the login.ejs file/login page
    res.redirect("/login");
});

module.exports = router;