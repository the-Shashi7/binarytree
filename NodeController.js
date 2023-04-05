const mongodb = require("mongodb");
// Node schema
const nodeSchema = {
  value: Number,
  left_child: { type: mongodb.ObjectId, ref: "Node" },
  right_child: { type: mongodb.ObjectId, ref: "Node" },
};

// Define the Node model
exports.Node = mongodb.model("Node", nodeSchema, "nodes");
