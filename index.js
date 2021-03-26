require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const List = require("./list");

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  console.log("/" + req.method);
  console.log("x-forwarded-for: ", req.headers["x-forwarded-for"]);
  console.log("Remote address: ", req.connection.remoteAddress);
  console.log("Request Path: ", req.path);
  next();
});

app.post("/list", (req, res) => {
  const { title, owner } = req.body;
  const list = new List({ title, owner });

  list.save((err, result) => (err ? res.send({ err }) : res.send({ result })));
});

app.put("/list", (req, res) => {
  const { _id, allow, owner } = req.body;

  if (allow !== undefined) {
    List.updateOne(
      { _id },
      { $set: { allow } },
      { runValidators: true },
      (err, result) => (err ? res.send({ err }) : res.send({ result }))
    );
  }

  if (owner !== undefined) {
    List.updateOne(
      { _id },
      { $set: { owner } },
      { runValidators: true },
      (err, result) => (err ? res.send({ err }) : res.send({ result }))
    );
  }
});
app.delete("/list/all", (req, res) => {
  List.deleteMany({}, (err, result) =>
    err ? res.send({ err }) : res.send({ result })
  );
});
app.get("/list/:id", (req, res) => {
  List.find({ _id: req.params.id }, (err, result) =>
    err ? res.send({ err }) : res.send({ result })
  );
});

app.get("/list/user/:email",(req,res)=>{
  List.find({owner: req.params.email},(err,result)=>err?res.send({err}):res.send({result}))
})

app.get("/list", (req, res) => {
  List.find({}, (err, result) =>
    err ? res.send({ err }) : res.send({ result })
  );
});

app.delete("/list/:id", (req, res) => {
  List.deleteOne({ _id: req.params.id }, (err, result) =>
    err ? res.send({ err }) : res.send({ result })
  );
});

app.listen(port, () => {
  console.log(`list-v1 listening on ${port}!`);
});
