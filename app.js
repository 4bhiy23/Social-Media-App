const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const userModel = require("./models/user")
const postModel = require("./models/post")
const path = require('path')
const user = require('./models/user')
app.set("view engine" , "ejs")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname , 'public')))

app.get("/" , (req , res) => {
    res.render("index")
})

app.get("/login" , (req , res) => {
    res.render("login")
})

app.get("/update/:id", isLoggedIn , async (req , res) => {
    let post = await postModel.findOne({_id: req.params.id})
    res.render("update" , {post})
})

app.get("/post/delete/:id", isLoggedIn, async (req, res) => {
    // 1. Delete the post from posts collection
    let deletedPost = await postModel.findOneAndDelete({ _id: req.params.id });

    // 2. Remove the post ID from the user's posts array
    await userModel.updateOne(
        { email: req.user.email },
        { $pull: { posts: deletedPost._id } }
    );

    res.redirect("/profile");
});

app.get("/profile" , isLoggedIn , async (req , res) => {
    let userData = await userModel.findOne({email: req.user.email}).populate("posts")
    // console.log(req.user)
    res.render("profile" , { userData })
})

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id });

    let user = await userModel.findOne({ email: req.user.email });

    if (post.likes.indexOf(user._id.toString()) === -1) {
        post.likes.push(user._id);
    } else {
        post.likes.splice(post.likes.indexOf(user._id.toString()), 1);
    }

    await post.save();
    res.redirect("/profile");
});

app.post("/update/:id", isLoggedIn , async (req , res) => {
    let post = await postModel.findOneAndUpdate({_id: req.params.id} , {content: req.body.content})
    res.redirect("/profile")
})

app.get("/logout" , (req , res) => {
    res.cookie("token" , "")
    res.redirect("/login")
})

app.post("/post" , isLoggedIn , async (req , res) => {
    let userData = await userModel.findOne({email: req.user.email})
    let {content} = req.body
    // console.log(content)
    // console.log("CONTENT RECEIVED:", content)

    let post = await postModel.create({
        user: userData._id,
        content
    })
 
    userData.posts.push(post._id)
    await userData.save()
    res.redirect("/profile")
})

app.post("/login" , async (req , res) => {
    let {password,email} = req.body
    let existingUser = await userModel.findOne({ email });
    if (!existingUser) return res.send("User does not exists");
        
    let matched = await bcrypt.compare(password , existingUser.password)
    if(!matched) return res.send("Something went wrong")

    let token = jwt.sign({email: existingUser.email} , "shh")
    res.cookie("token" , token)
    // res.send(matched)
    res.redirect("/profile")
})

app.post("/register" , async (req , res) => {
    let {username , name , password , email , age} = req.body
    let existingUser = await userModel.findOne({ email });
    if (existingUser) return res.send("User Already exists");
        
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let user = await userModel.create({
                username,
                name,
                password: hash,
                email,
                age
            })

            let token = jwt.sign({email: user.email} , "shh")
            res.cookie("token" , token)
            res.send("User registered successfully");
            
        });
    });        
})

function isLoggedIn(req, res, next) {
    let token = req.cookies.token;

    if (!token) return res.redirect("/login");
    let data = jwt.verify(token, "shh");
    req.user = data;
    next();
}

app.listen(3000)