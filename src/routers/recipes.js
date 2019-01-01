import { ObjectID } from 'mongodb';
import express from 'express';
import validator from 'validator';
import { RecipeModel } from '../models/Recipes';

export const recipesRouter = express.Router();


recipesRouter.param('recipeId', (req, res, next, recipeId) => {
  if(recipeId) {
    req.recipeId = recipeId;
    return next();
  }
  next(new Error('incorrect recipeId format'));
});

recipesRouter.get('/', (req, res, next) => {
  RecipeModel
    .find({})
    .then(response => res.send(response))
    .catch(err => next(err));
});

recipesRouter.get('/:recipeId', (req, res, next) => {
  const id = req.recipeId;
  const query = {
    _id: ObjectID(id)
  };
  RecipeModel
    .find(query)
    .then(response => res.send(response))
    .catch(err => next(err));
});

recipesRouter.post('/', (req, res, next) => {
  if(!validator.isInt(req.body.age))
    next(new Error('Incorrect age format'));

  const user = new RecipeModel({
    title: req.body.title,
    age: req.body.age
  });
  user.save()
      .then(newUser => res.send(newUser))
      .catch(err => next(err));

});

recipesRouter.put('/:recipeId', (req, res, next) => {
  const id = req.recipeId;

  if(req.body.age && !validator.isInt(req.body.age))
    next(new Error('Incorrect age format'));

  RecipeModel
    .updateOne({_id: ObjectID(id)}, {$set: req.body})
    .then(response => res.status(201).send(response))
    .catch(err => next(err));
});

recipesRouter.delete('/:recipeId', (req, res, next) => {
  const id = req.recipeId;

  RecipeModel
    .deleteOne({_id: ObjectID(id)})
    .then(response => res.status(204).send(response))
    .catch(err => next(err));
});


recipesRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});
