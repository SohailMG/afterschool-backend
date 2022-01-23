const { MongoClient, ObjectId } = require("mongodb");
let db;
(async function connectDb() {
  const uri =
    "mongodb+srv://root:rootpass123@afterschool-app.j4rka.mongodb.net/test";
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    db =  (await client.connect()).db('school-app');
    console.log("Connected to MongoDB cluster ", db.databaseName);
    return db
  } catch (e) {
    console.error(e);
  }
}())

async function storeOrderInDb(req,res,next){
    const orderDetails = req.body;
    const lessonId = orderDetails["_id"]["$oid"];
    const { subject, location, price, space, image } = orderDetails;
    const results = await db
      .collection("orders")
      .find({ lessonId: lessonId })
      .toArray();

    if (results.length === 1) {
      db.collection("orders").updateOne({lessonId: lessonId},{$inc:{quantity:1}})
      res.status(200).send("updated quantity");
    } else {
      const order = {
        lessonId,
        subject,
        location,
        price,
        space,
        image,
        quantity: 1,
      };
      db.collection("orders").insertOne(order, (err, res) => {
        if (err) throw err;
      });
      res.status(200).send(order);
    }

}

async function getLessonsFromDb(req,res,next){
   req.collection.find({}).toArray((err, result) => {
     if (err) console.log(err);
     res.send(result);
   });
}



module.exports = { storeOrderInDb, getLessonsFromDb };
