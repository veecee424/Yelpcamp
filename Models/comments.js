//require mongoose
let mongoose = require("mongoose");


//Write a comment Schema
let CommentSchema = new mongoose.Schema({
    text: String,
    author: {
            id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }      
            
});

//Write a model for exports
let Comment = mongoose.model("comment", CommentSchema);

//Export this file to make it available anywhere it is required
module.exports = Comment;