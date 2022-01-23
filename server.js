const express = require("express");
const app = express();
const port = 3000;
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDb, storeOrderInDb, getLessonsFromDb } = require("./db-controllers");
// app.use(bodyParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect to mongodb database

app.param("name", async (req, res, next, collectionName) => {
  const db = await connectDb();
  req.collection = db.collection(collectionName);
  return next();
});
// GET /collection/lessons returns list of lessons from mongodb
app.get("/collection/:name", getLessonsFromDb);
// POST /orders
app.post("/orders", storeOrderInDb );

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
