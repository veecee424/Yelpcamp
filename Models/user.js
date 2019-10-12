let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");


let UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

let User = mongoose.model("user", UserSchema);

module.exports = User;

