const { MongoClient, ObjectId } = require("mongodb");
let db;
async function connectDb() {
  const uri =
    "mongodb+srv://root:rootpass123@afterschool-app.j4rka.mongodb.net/test";
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    db = (await client.connect()).db("school-app");
    return db;
  } catch (e) {
    console.error(e);
  }
}

async function storeOrderInDb(req, res, next) {
  const { name, phone, space, lessonId } = req.body;
  req.collection.insertOne({ name, phone, space, lessonId }, (err, result) => {
    if (err) throw err;
    res.send({ orderId: result.insertedId });
  });
}

async function getLessonsFromDb(req, res, next) {
  req.collection.find({}).toArray((err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
}

async function updateLessonSpaces(req, res, next) {
  req.collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { space: req.body.spaces } },
    { safe: true, multi: false },
    (err, result) => {
      if (err) throw err;
      res.status(200).send("updated spaces");
    }
  );
}

async function deleteLessonFromDb(req, res, next) {
  req.collection.deleteOne(
    { _id: new ObjectId(req.params.id) },
    (err, results) => {
      if (err) throw err;
      res.status(200).send("lesson deleted");
    }
  );
}
module.exports = {
  deleteLessonFromDb,
  connectDb,
  updateLessonSpaces,
  storeOrderInDb,
  getLessonsFromDb,
};
