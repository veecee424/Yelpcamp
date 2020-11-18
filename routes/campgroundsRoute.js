let express = require("express");
let router = express.Router();
let Campground = require("../Models/campground");
let app = require("../app");
let middleware = require("../middleware/middleware");


router.get("/", function (req, res) {
    res.render("home.ejs");
    });
    


router.get("/campgrounds", function (req, res) {
    
    Campground.find({}, function(err, CampgroundData) {
   
    if(err) {
        req.flash("error", "Something went wrong!");
        console.log(err);
    } else {
       
          res.render("index.ejs", {campgrounds: CampgroundData});
    }
    });
    });
    
    
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
    
    Campground.create(campObject,  function (err, data) {
    if (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
    } else {
       
       req.flash("success", "campground successfully added!")
       res.redirect("/campgrounds"); 
       
    }
    })
    
    });
    
  
router.get("/campgrounds/new", middleware.isLoggedIn,  function(req, res) {
     res.render("new.ejs");
    });
    
  
router.get("/campgrounds/:id", function(req, res) {
        let campId = req.params.id;
    Campground.findById(campId, function (err, foundCamp) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
        } else {
           
            foundCamp.populate("comments").execPopulate(function(err, populatedData){
                if(err) {
                    console.log(err); 
                    req.flash("error", "Something went wrong!");
                } else {
                    
                
                   
                  res.render("show.ejs", {campground: populatedData});
                }
            }); 
        }
    })
    });


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


    module.exports = router;
    