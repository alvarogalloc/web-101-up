const express = require("express");
const app = express();
const https = require("https");

// TODO: configure the express server
app.use(express.urlencoded({ extended: true })); // para formularios
app.use(express.json()); // para json
app.set("view engine", "ejs"); // motor de plantillas para usar .ejs
// use public folder for static files
app.use(express.static("public")); // carpeta de archivos staticos
app.set("views", "./views"); // carpeta de vistas(archivos staticos)

const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

let posts = [
  {
    "title": "Dummy post",
    "body": "facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut."
  }
];

// global as we use it persistently
// if name is empty, there is no one logged in so return to index 
let name = '';

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/html/index.html");
// });
app.get("/", (req, res) => {
  name = '';
  res.render("index");
});


// insecure 
app.get("/login", (req, res) => {
  const user = req.query.user;
  name = user;
  res.render("test", { user: name, securityLevel: "Insecure (GET)" });
});

// secure 
app.post("/login", (req, res) => {
  const user = req.body.user;
  name = user;
  res.render("test", { user: name, securityLevel: "Secure (POST)" });
});


app.get("/home", (req, res) => {
  if (!name)
    res.redirect('/') // return to login
  else {
    const summarizedPosts = posts.map(post => {
      let summary = post.body;
      if (summary.length > 100) summary = summary.slice(0, 100) + "...";
      return { title: post.title, body: summary };
    });
    res.render("home", { user: name, posts: summarizedPosts });
  }
});

app.post("/post", (req, res) => {
  const { title, body } = req.body;
  posts = [...posts, { title, body }];
  console.log(posts)
  res.redirect('/home')
});
app.get("/post/:id", (req, res) => {
  const id = req.params.id;
  if (id < 0 || id >= posts.length) {
    return res.status(404).json({ error: 'Invalid post ID' });
  }
  res.render('post', { id, post: posts[id] });
});

app.post("/post/:id", (req, res) => {
  const id = req.params.id;
  const { title, body } = req.body;
  if (id < 0 || id >= posts.length) {
    return res.status(404).json({ error: 'Invalid post ID' });
  }
  posts[id]={title, body};
  res.redirect('/home')
});
app.delete("/post/:id", (req, res) => {
  const id = req.params.id;
  posts=posts.filter((_, idx, _2) => idx !==parseInt(id));
  res.redirect('/home')
});




app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
