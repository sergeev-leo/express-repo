import mongoose from 'mongoose';
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
  hashedPassword: String,
  created: {
    type: Date,
    default: Date.now()
  }

});

UserSchema.virtual('password')
    .set(function(password){
        this.hashedPassword = bcrypt.hashSync(password, 15);
    });


UserSchema.methods.verifyPassword = function(password){
  return bcrypt.compareSync(password, this.hashedPassword);
};

export const UserModel = mongoose.model('users', UserSchema);