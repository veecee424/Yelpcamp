let Comment = require("../Models/comments");
let Campground = require("../Models/campground");


let middlewareObj = {
    checkCommentOwnership: function (req, res, next) {
                if(req.isAuthenticated()) {
           
            Comment.findById(req.params.commentId, function(err, Commentfound) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                } else {
                    
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
        
        if(req.isAuthenticated()) {
          
            Campground.findById(req.params.id, function(err, campfound) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                } else {
                  
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



module.exports = middlewareObj;