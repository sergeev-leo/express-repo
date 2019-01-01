import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now()
  }

});


export const RecipeModel = mongoose.model('recipes', RecipeSchema);