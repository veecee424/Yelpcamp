//require mongoose
let mongoose = require("mongoose");

let CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    //In a campground, store comments as an array of object id
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ],
    //To Store the user, or creator of a campground as an object of user id and username
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
});

//create a campground model
let Campground = mongoose.model("Campground", CampgroundSchema);

//Export the campground model
module.exports = Campground;