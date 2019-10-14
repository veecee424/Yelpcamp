let express = require("express");
let router = express.Router();
let Campground = require("../Models/campground");
let app = require("../app");
let middleware = require("../middleware/middleware");

//route the homepage
router.get("/", function (req, res) {
    res.render("home.ejs");
    });
    

//route the campgrounds page -- INDEX REST ROUTE (get)
router.get("/campgrounds", function (req, res) {
    //find all campgrounds
    Campground.find({}, function(err, CampgroundData) {
    //if an error exists, show it
    if(err) {
        req.flash("error", "Something went wrong!");
        console.log(err);
    } else {
        //if it doesn't, render the campgrounds page and use the returned data
          res.render("index.ejs", {campgrounds: CampgroundData});
    }
    });
    });
    
    //post to campgrounds -- CREATE REST ROUTE (post)
router.post("/campgrounds", function(req, res) {
    let name = req.body.campName;
    let image = req.body.campImage;
    let price = req.body.price;
    let desc = req.body.description;
    let id = req.user._id;
    let username = req.user.username;
    let campObject = {
        name: name,
        image: image,
        description: desc,
        price: price,
        User: {
            id: id,
            username: username
        }
    }
    //After capturing the name and image url, use it to create a campground
    Campground.create(campObject,  function (err, data) {
    if (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
    } else {
       //console.log(data.User);
       req.flash("success", "campground successfully added!")
       res.redirect("/campgrounds"); //redirect to campgrounds get route
       
    }
    })
    
    });
    
    //Route for adding new campgrounds -- NEW REST ROUTE (get)
router.get("/campgrounds/new", middleware.isLoggedIn,  function(req, res) {
     res.render("new.ejs");
    });
    
    //Route for a page to display specific selections -- SHOW ROUTE (get)
    //Note that /campgrounds/new above can pass for this route, therefeore, ensure to do the new (REST) route first before this one
router.get("/campgrounds/:id", function(req, res) {
        let campId = req.params.id;
    Campground.findById(campId, function (err, foundCamp) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
        } else {
            //console.log(foundCamp);
            foundCamp.populate("comments").execPopulate(function(err, populatedData){
                if(err) {
                    console.log(err); 
                    req.flash("error", "Something went wrong!");
                } else {
                    
                
                   //console.log(foundCamp);
                  //console.log(populatedData);
                  res.render("show.ejs", {campground: populatedData});
                }
            }); 
        }
    })
    });

//EDIT CAMPGROUND ROUTE
//Show the form
router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, function(req, res,) {
    let campId = req.params.id;
    Campground.findById(campId, function(err, foundCamp) {
        if (err) {
            req.flash("error", "Something went wrong!");
            console.log(err);
            
        } else {
            res.render("EditCampground.ejs", {camp: foundCamp});
        }
    });
});
//Handle form input to update camp info
router.put("/campgrounds/:id", middleware.checkCampOwnership, function(req, res) {
    let updateData = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price
    }
    Campground.findByIdAndUpdate(req.params.id, updateData, function(err, updatedCamp) {
        if(err) {
            req.flash("error", "Something went wrong!");
            console.log(err) 
            
        } else {
            req.flash("success", "Camp info Successfully updated");
            res.redirect("/campgrounds/"+ req.params.id);
            
        }
    })
});

//Delete Route
router.delete("/campgrounds/:id", middleware.checkCampOwnership, function(req, res) {
    Campground.findOneAndDelete(req.params.id, function(err) {
        if(err) {
            console.log(err)
            req.flash("error", "Something went wrong!");
        } else { 
            req.flash("success", "Successfully deleted");
            res.redirect("/campgrounds");
            
            
        }
    })
})


//Write a middleware to ascertain of the signed in user is the creator of a campground

    module.exports = router;
    