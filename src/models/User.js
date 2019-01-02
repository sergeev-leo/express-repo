import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
    email: {
      type: String,
      // required: true,
      lowercase: true
    },
  age: Number,
  hashedPassword: String
}, { timestamps: true});

export const User = mongoose.model('user', UserSchema);