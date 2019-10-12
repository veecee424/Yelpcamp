let express = require("express");
let router = express.Router();
let Campground = require("../Models/campground");
let Comment = require("../Models/comments");
let User = require("../Models/user");
let middleware = require("../middleware/middleware");

//Each individual campground should have its own comments resulting in nested routes (ie) campgrounds/:id/comments/new, and campgrounds/:id/comments
//We'd have a new comments route which renders a form page where we'd input our comments - GET
//Then on the form page, have a post request for handling of inputed data

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
    //When a comment is posted,
    //1) Find campgrounds and ascertain the one which its id is querried
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
                    //let the comment's author bear the user's details
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    //then save
                    createdComment.save();
                 
                    foundCamp.comments.push(createdComment);
                    //then save.... NOTE THAT WHENEVER YOU MAKE A CHANGE TO THE SCHEMA OF A DOCUMENT FROM A MAIN CODE(THIS FOR EXAMPLE), ENSURE TO SAVE THE NEWLY CREATED DOCUMENT WITH .save();
                    foundCamp.save();
                    res.redirect("/campgrounds/"+ foundCamp._id);
                  //  console.log(populatedData.comments)
                }
            });
        }
    })
    //2) then extract the values of the form inputs and use them to create comments
    //3) populate the campground with its associated comments, save, and redirect to the show page of that particular campground
});

//EDIT COMMENTS ROUTE
//Show a form field for comment editing
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

//Handle update input
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

//DELETE COMMENT ROUTE
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