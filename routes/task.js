var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Authentication")
  .then(() => {
    console.log("MongoDb connected");
  })
  .catch((err) => {
    console.error(err);
  });

const taskScheme = new mongoose.Schema({
  title: { type: String, required: true },
  about: { type: String, required: true },
  date: { type: Date, required: true },
});

const Task = mongoose.model("task", taskScheme);

//view all
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    console.log(error);
  }
});

// create task
router.post("/create-task", async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      about: req.body.about,
      date: req.body.date,
    });

    await task.save();
    res.status(200).json({ message: "task submitted successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

//view one
router.get("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    
    if (!taskId) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

// router.put("/edit-task/:id", async (req, res) => {

//   // try {
//   //   const { id } = req.params;
//   //   const collection = await MongoClient.connect(URL);
//   //   const db = collection.db("Authentication");
//   //   const edittask = await db
//   //     .collection("task")
//   //     .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: req.body });
//   //   res.json({ message: "Task updated sucessfully" });
//   //   await this.connect.close();
//   // } catch (error) {
//   //   console.log(error);
//   //   res.status(500).status({ message: "someting went wrong" });
//   // }
// });

// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const collection = await MongoClient.connect(URL);
//     const db = collection.db("Authentication");
//     const task = await db
//       .collection("task")
//       .deleteOne({ _id: new ObjectId(id) });
//     res.json({ message: "Task deleted" });
//     await collection.close();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "something went wrong" });
//   }
// });

module.exports = router;
