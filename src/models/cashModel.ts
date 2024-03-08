import mongoose from "mongoose";

// Create a schema for the User model
const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
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
    type: String,default:"pending"

  },
  hrApprove: {
    type: String,default:"pending"
  },
  accountantApprove: {
    type: String,default:"pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  attachment: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model, creating it if it doesn't already exist
export default mongoose.models.CashRequest ||
  mongoose.model("CashRequest", userSchema);
