let express = require("express");
let router = express.Router();
let Campground = require("../Models/campground");
let Comment = require("../Models/comments");
let User = require("../Models/user");
let middleware = require("../middleware/middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campdata) {
        if (err) {
            console.log(err) 
        } else {
            res.render("NewComment.ejs", {campdata: campdata});
        }
    });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
        } else {
            Comment.create(req.body.Comment, function(err, createdComment) {
                if(err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err)
                } else {
                    
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    
                    createdComment.save();
                 
                    foundCamp.comments.push(createdComment);
                    
                    foundCamp.save();
                    res.redirect("/campgrounds/"+ foundCamp._id);
                 
                }
            });
        }
    })
    
});


router.get("/campgrounds/:id/comments/:commentId/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.commentId, function(err, foundComment) {
        if(err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
        } else {
            Campground.findById(req.params.id, function(err, foundCamp) {
                if(err) {
                    console.log(err)
                } else {
                    res.render("EditComment.ejs", {foundComment: foundComment, foundCamp: foundCamp});
                    
                }
            })
        }
    })
    
});


router.put("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership, function(req, res) {
    let commentUpdate = {
        text: req.body.text
    }
    Comment.findByIdAndUpdate(req.params.commentId, commentUpdate, function(err, updatedComment) {
        if(err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
});


router.delete("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndDelete(req.params.commentId, function(err) {
        if(err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
            
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/"+ req.params.id);
            
        }
    });
})


module.exports = router;