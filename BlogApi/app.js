const express = require("express");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${getExt(file.mimetype)}`);
  },
});

const getExt = (mimeType) => {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpeg";
    case "image/jpg":
      return ".jpg";
  }
};

var upload = multer({ storage: storage });
const app = express();
const Post = require("./api/models/posts");
const postData = new Post();

// middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/uploads", express.static("uploads"));

// api endpoints
app.get("/api/posts", (req, res) => {
  res.status(200).send(postData.get());
});

app.get("/api/post/:post_id", (req, res) => {
  const postId = req.params.post_id;
  const post = postData.getIndividualBlogPost(postId);
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(404).send("No post found!");
  }
});

app.post("/api/post", upload.single("post-image"), (req, res) => {
  const newPost = {
    id: `${Date.now()}`,
    title: req.body.title,
    content: req.body.content,
    post_image: req.file.path,
    added_date: `${Date.now()}`,
  };
  postData.add(newPost);
  res.status(201).send("Ok");
});

app.listen(3000, () => console.log(`Listening on http://localhost:3000`));
