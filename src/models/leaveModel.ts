import mongoose from "mongoose";

// Create a schema for the User model
const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  attachment: {
    type: String,
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
  managerApprove: {
    type: String,default:"pending"

  },
  hrApprove: {
    type: String,default:"pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // leaveDate: {
  //   type: String,
  // },
  dateFrom:{
    type:String
  },
  dateTo:{
    type:String
  },
  numberOfDays:{
    type:Number
  }
});

// Export the model, creating it if it doesn't already exist
export default mongoose.models.LeaveRequest ||
  mongoose.model("LeaveRequest", leaveSchema);