import mongoose from 'mongoose';

// Create a schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Do not return the password by default
  },
  role:{type:String,default:"employee"},
  leavesBalance:{type:Object,default:{sick:10,casual:10}},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model, creating it if it doesn't already exist
export default mongoose.models.User || mongoose.model('User', userSchema);
