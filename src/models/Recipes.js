import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });


export const Recipe = mongoose.model('recipe', RecipeSchema);