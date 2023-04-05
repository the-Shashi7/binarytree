const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const app = express();
app.use(bodyParser.json());

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/mydb";
MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log("Error connecting to database");
    process.exit(1);
  }

  console.log("Connected to database");
});

// Define the Node schema
const nodeSchema = {
  value: Number,
  left_child: { type: mongodb.ObjectId, ref: "Node" },
  right_child: { type: mongodb.ObjectId, ref: "Node" },
};

// Define the Node model
const Node = mongodb.model("Node", nodeSchema, "nodes");

app.get("/search", async (req, res) => {
  const { startValue } = req.query;

  const startNode = await Node.findOne({ value: startValue });
  if (!startNode) {
    return res.status(404).send("Node not found");
  }
  const queue = [startNode];
  const visited = new Set();

  while (queue.length > 0) {
    const currNode = queue.shift();
    if (visited.has(currNode._id)) {
      continue;
    }

    visited.add(currNode._id);
    console.log(currNode.value);
    if (currNode.left_child) {
      const leftChild = await Node.findById(currNode.left_child);
      queue.push(leftChild);
    }
    if (currNode.right_child) {
      const rightChild = await Node.findById(currNode.right_child);
      queue.push(rightChild);
    }
  }
  res.send("Search complete");
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
