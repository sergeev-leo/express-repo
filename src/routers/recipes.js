import { ObjectID } from 'mongodb';
import express from 'express';
import validator from 'validator';
import {Recipe} from "../models/Recipes";

export const recipesRouter = express.Router();


recipesRouter.param('recipeId', (req, res, next, recipeId) => {
    if(recipeId) {
        req.recipeId = ObjectID(recipeId);
        return next();
    }
    next(new Error('incorrect recipeId format'));
});

recipesRouter.get('/', (req, res, next) => {
    Recipe
        .find({})
        .then(response => res.send(response))
        .catch(err => next(err));
});

recipesRouter.get('/:recipeId', (req, res, next) =>
    Recipe
        .findById(req.recipeId)
        .then(response => res.send(response))
        .catch(err => next(err))
);

recipesRouter.post('/', (req, res, next) => {
    if(!validator.isInt(req.body.age))
        next(new Error('Incorrect age format'));

    const recipe = new Recipe({
        name: req.body.name,
        age: req.body.age
    });
    recipe.save()
        .then(newUser => res.send(newUser))
        .catch(err => next(err));

});

recipesRouter.put('/:recipeId', (req, res, next) => {
    if(req.body.age && !validator.isInt(req.body.age))
        next(new Error('Incorrect age format'));

    Recipe
        .updateOne({_id: req.recipeId}, {$set: req.body})
        .then(response => res.status(201).send(response))
        .catch(err => next(err));
});

recipesRouter.delete('/:recipeId', (req, res, next) =>
    Recipe
        .deleteOne({_id: req.recipeId})
        .then(response => res.status(204).send(response))
        .catch(err => next(err))
);


recipesRouter.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
});