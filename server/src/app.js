const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

const mongodb_conn_module = require("./mongodbConnModule");
var db = mongodb_conn_module.connect();

var Post = require("../models/post");

app.get("/posts", (req, res) => {
  Post.find({}, "name department", function(error, posts) {
    if (error) {
      console.error(error);
    }
    res.send({
      posts: posts
    });
  }).sort({ _id: -1 });
});

app.post("/add_post", (req, res) => {
  var db = req.db;
  var name = req.body.name;
  var department = req.body.department;
  var new_post = new Post({
    name,
    department
  });

  new_post.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true
    });
  });
});

app.put("/posts/:id", (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, "name department", function(error, post) {
    if (error) {
      console.error(error);
    }

    post.name = req.body.name;
    post.department = req.body.department;
    post.save(function(error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true
      });
    });
  });
});

app.delete("/posts/:id", (req, res) => {
  var db = req.db;
  Post.remove(
    {
      _id: req.params.id
    },
    function(err, post) {
      if (err) res.send(err);
      res.send({
        success: true
      });
    }
  );
});

app.get("/post/:id", (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, "name skills", function(error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});

app.listen(process.env.PORT || 8081);
