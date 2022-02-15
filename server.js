const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const {
  connectDb,
  storeOrderInDb,
  getLessonsFromDb,
  updateLessonSpaces,
  deleteLessonFromDb,
  searchLessons,
} = require("./database");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// api logger middleware
const myLogger = (req, res, next) => {
  console.log(
    `Incoming request : => (${res.statusCode}) ${req.method} ${req.url}`
  );
  next();
};
app.use(myLogger);

// call back trigger for rout params
app.param("name", async (req, res, next, collectionName) => {
  // connecting to database
  const db = await connectDb();
  // checking
  if (collectionName === "lessons" || collectionName === "orders") {
    req.collection = db.collection(collectionName);
    return next();
  } else {
    return res.status(500).send({ message: "Invalid collection" });
  }
});

// home rout
app.get("/", (req, res) => {
  res.status(200).send("Hello world! from server");
});
// GET /collection/lessons returns list of lessons from mongodb
app.get("/collection/:name", getLessonsFromDb);
// POST /orders
app.post("/collection/:name", storeOrderInDb);
// update lesson spaces in mongodb
app.put("/collection/:name/:id", updateLessonSpaces);
// delete mongodb document
app.delete("/collection/:name/:id", deleteLessonFromDb);
// search path
app.get("/collection/:name/search", searchLessons);

// static files middleware
app.use((req, res, next) => {
  const filePath = path.join(__dirname, "images", req.url);
  fs.stat(filePath, (err, fileInfo) => {
    if (err) {
      next();
      return;
    }
    if (fileInfo.isFile()) res.sendFile(filePath);
    else next();
  });
});

// error handling middleware
app.use((req, res) => {
  res.status(404).send({ message: "File not found" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running  ${process.env.PORT || 5000}`);
});
