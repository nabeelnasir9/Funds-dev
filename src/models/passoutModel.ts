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
  reason: {
    type: String,
  },
  status: {
    type: String,
    default:"pending"
  },
  passOut: {
    type: String,
    required: [true, "Please add a passOut time"],
  },
  mangerApprove: {
    type: String,default:"pending"

  },
  hrApprove: {
    type: String,default:"pending"
  },
  passOutTotalHours:{
    type:Number,default:0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 
});

// Export the model, creating it if it doesn't already exist
export default mongoose.models.PassoutRequest ||
  mongoose.model("PassoutRequest", userSchema);
