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
 
  status: {
    type: String,
    default:"pending"
  },
 
  mangerApprove: {
    type: String,default:"pending"

  },
  accountantApprove: {
    type: String,default:"pending"
  },
  attachment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 
});

// Export the model, creating it if it doesn't already exist
export default mongoose.models.InvoiceRequests ||
  mongoose.model("InvoiceRequests", userSchema);
