const mongoose = require("mongoose")
const { type } = require("os")
const { ref } = require("process")

mongoose.connect("mongodb://127.0.0.1:27017/miniProject")

let userSchema = mongoose.Schema({
    username: String,
    name: String,
    password: String,
    email: String,
    age: Number,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }]
})

module.exports = mongoose.model("user" , userSchema)