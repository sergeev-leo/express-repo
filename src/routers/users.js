import { ObjectID } from 'mongodb';
import express from 'express';
import validator from 'validator';
import { User } from '../models/User';

export const usersRouter = express.Router();


usersRouter.param('userId', (req, res, next, userId) => {
  if(userId) {
    req.userId = ObjectID(userId);
    return next();
  }
  next(new Error('incorrect userId format'));
});

usersRouter.get('/', (req, res, next) => {
  User
    .find({})
    .then(response => res.send(response))
    .catch(err => next(err));
});

usersRouter.get('/:userId', (req, res, next) =>
  User
    .findById(req.userId)
    .then(response => res.send(response))
    .catch(err => next(err))
);

usersRouter.post('/', (req, res, next) => {
  if(!validator.isInt(req.body.age))
    next(new Error('Incorrect age format'));

  const user = new User({
    userName: req.body.userName,
    age: req.body.age,
    email: req.body.email
  });
  user.save()
      .then(newUser => res.send(newUser))
      .catch(err => next(err));

});

usersRouter.put('/:userId', (req, res, next) => {
  if(req.body.age && !validator.isInt(req.body.age))
    //TODO check user email
    next(new Error('Incorrect age format'));

  User
    .updateOne({_id: req.userId}, {$set: req.body})
    .then(response => res.status(201).send(response))
    .catch(err => next(err));
});

usersRouter.delete('/:userId', (req, res, next) =>
  User
    .deleteOne({_id: req.userId})
    .then(response => res.status(204).send(response))
    .catch(err => next(err))
);


usersRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});
