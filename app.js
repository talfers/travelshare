//APP CONFIGURATION
var methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"), 
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    app                 = express();

mongoose.connect("mongodb://localhost/travel_share");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
//MUST GO AFTER BODYPARSER
app.use(methodOverride("_method"));
//MUST tell app to look for _method to do PUT/DELETE request

//MONGOOSE CONFIGURATION
var blogSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: "placeholderimg.jpg"},
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//CREATE A BLOG
/*Blog.create({
    title: "My First Blog",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=59f17a21ae8a708059646146af380320&auto=format&fit=crop&w=1050&q=80",
    body: "This is the best blog ever. I am blogging and blogging all over the place. Looks at that blog and look at that other one!"
}, function(err, newBlog){
    if(err){
        console.log(err);
    } else {
        console.log(newBlog);
    }
});*/



//RESTful ROUTES
//Index Route
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//Blogs Route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//New Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//Create Route
app.post("/blogs", function(req, res) {
    //Create new blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//Update Route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    /*Blog.findByIdAndUpdate(id, newData, callback)*/
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
    
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SERVER CONFIGURATION
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Travelshare server started on port " + process.env.PORT);
});