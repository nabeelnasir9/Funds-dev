import mongoose from "mongoose";

// Create a schema for the User model
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  amount: {
    type: Number,
    required: [true, "Please add an amount"],
  },
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: [true, "Please add a type"],
  },
  mangerApprove: {
    type: Object,
    default: { checked: false, status: "pending" },

  },
  hrApprove: {
    type: Object,
    default: { checked: false, status: "pending" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model, creating it if it doesn't already exist
export default mongoose.models.CashRequest ||
  mongoose.model("CashRequest", userSchema);
