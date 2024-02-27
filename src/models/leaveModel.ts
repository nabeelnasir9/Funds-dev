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
    type: String,default:"pending"

  },
  hrApprove: {
    type: String,default:"pending"
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
