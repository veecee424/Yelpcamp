
let mongoose = require("mongoose");


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


let Comment = mongoose.model("comment", CommentSchema);


module.exports = Comment;