let Comment = require("../Models/comments");
let Campground = require("../Models/campground");
//Make an object to contain all middleware functions/objects

let middlewareObj = {
    checkCommentOwnership: function (req, res, next) {
        //Check if user is logged in first
        if(req.isAuthenticated()) {
            //if a user is logged in, find out who it is and compare with the comment's author id
            Comment.findById(req.params.commentId, function(err, Commentfound) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                } else {
                    //check if the shown comment author's id is same as the logged in user's if
                    if(Commentfound.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("/campgrounds");
                        req.flash("error", "You ain't permitted to do that!");
                    }
                }
            });
        } else {
            res.redirect("/login");
            req.flash("error", "Sorry, You need to be logged in to do that!");
        }
    },

    isLoggedIn: function (req, res, next) {
        if(req.isAuthenticated()) {
            next();
        } else {
            req.flash("error", "Sorry, You need to be logged in to do that!");
            res.redirect("/login");
        }
    },

    checkCampOwnership: function (req, res, next) {
        //Check if user is logged in first
        if(req.isAuthenticated()) {
            //if a user is logged in, find out who it is and compare with the campground's user/creator id
            Campground.findById(req.params.id, function(err, campfound) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                } else {
                    //check if the shown campground's user id is same as the logged in user's if
                    if(campfound.User.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You ain't permitted to do that!");
                        res.redirect("/campgrounds");
                    }
                }
            });
        } else {
            req.flash("error", "Sorry, You need to be logged in to do that!");
            res.redirect("back")
        }
    }
    
}


//Export middleware
module.exports = middlewareObj;