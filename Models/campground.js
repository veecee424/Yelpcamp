
let mongoose = require("mongoose");

let CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
  
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ],

    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
});


let Campground = mongoose.model("Campground", CampgroundSchema);


module.exports = Campground;