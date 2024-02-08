const mongoose = require('mongoose') 
const findOrCreate = require('mongoose-findorcreate');
const UserSchema = new mongoose.Schema({
    googleId : String,
    name: String,
    email : String,
    gender : String,
    verified : {
        type : Boolean,
        default : false
    },
    instaHandle : String,
    height : String,
    meetingLink : String,
    meetingTime : String,
});


UserSchema.plugin(findOrCreate);

const User = mongoose.model("User", UserSchema);

module.exports = User

