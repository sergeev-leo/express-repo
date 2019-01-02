import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
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

UserSchema.methods.generateJWT = function(){
  return jwt.sign(
    {
      email: this.email
    },
    process.env.JWT_SECRET_KEY
  );
};

UserSchema.methods.toAuthJSON = function(){
  return {
    email: this.email,
    token: this.generateJWT()
  }
};

export const User = mongoose.model('user', UserSchema);