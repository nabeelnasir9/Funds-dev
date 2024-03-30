import mongoose from "mongoose";

// Create a schema for the Invoice model
const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  invoiceNo: {
    type: String,
    required: [true, "Please add an invoice number"],
  },
  dateOfInvoice: {
    type: String,
    required: [true, "Please add the date of the invoice"],
  },
  invoiceDescription: {
    type: String,
    required: [true, "Please add an invoice description"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please add the total amount"],
  },
  totalAmountExclVAT: {
    type: Number,
    required: [true, "Please add the total amount excluding VAT"],
  },
  expense: {
    type: Number,
    required: [true, "Please add the expense"],
  },
  netEarning: {
    type: Number,
    required: [true, "Please add the net earning"],
  },
  percentage: {
    type: Number,
    required: [true, "Please add the percentage"],
  },
  status: {
    type: String,
    default: "pending"
  },
  managerApprove: {
    type: String,
    default: "pending"
  },
  accountantApprove: {
    type: String,
    default: "pending"
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
export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
