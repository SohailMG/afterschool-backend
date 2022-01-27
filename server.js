const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  connectDb,
  storeOrderInDb,
  getLessonsFromDb,
  updateLessonSpaces,
  deleteLessonFromDb,
} = require("./db-controllers");
// app.use(bodyParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// api logger middleware
const myLogger = (req, res, next) => {
  console.log(`API REQUEST : => (${res.statusCode}) ${req.method} ${req.url}`);
  next();
};
app.use(myLogger);
// app.use(express.static("public"));
app.param("name", async (req, res, next, collectionName) => {
  const db = await connectDb();
  if (collectionName === "lessons" || collectionName === "orders") {
    req.collection = db.collection(collectionName);
    return next();
  } else {
    res.status(500).send({ message: "Invalid collection" });
  }
});

// GET /collection/lessons returns list of lessons from mongodb
app.get("/collection/:name", getLessonsFromDb);
// POST /orders
app.post("/collection/:name", storeOrderInDb);
// update lesson spaces in mongodb
app.put("/collection/:name/:id", updateLessonSpaces);
// delete mongodb document
app.delete("/collection/:name/:id", deleteLessonFromDb);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running  ${process.env.PORT || 5000}`);
});
