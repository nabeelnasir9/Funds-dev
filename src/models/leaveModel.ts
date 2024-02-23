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
  reason: {
    type: String,
    required: [true, "Please add an amount"],
  },
  status: {
    type: String,
    required: true,
    default:"pending"
  },
  leaveType: {
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
  leaveDate: {
    type: String,
  },
});

// Export the model, creating it if it doesn't already exist
export default mongoose.models.LeaveRequest ||
  mongoose.model("LeaveRequest", userSchema);
