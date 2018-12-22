import { ObjectID } from 'mongodb';
import express from 'express';
import { UserModel } from '../models/User';

export const usersRouter = express.Router();


usersRouter.param('userId', (req, res, next, userId) => {
  //проверяем userId и либо присоединяем его к объекту запроса, либо выкидываем ошибку
  if(req.params.userId) {
    req.userId = req.params.userId;
    return next();
  }
  next(new Error('incorrect userId format'));
});

usersRouter.get('/', (req, res, next) => {
  return UserModel
    .find({})
    .then(response => res.send(response))
    .catch(err => next(err));
});

usersRouter.get('/:userId', (req, res, next) => {
  const id = req.userId;
  const query = {
    _id: ObjectID(id)
  };
  return UserModel
    .find(query)
    .then(response => res.send(response))
    .catch(err => next(err));
});

usersRouter.post('/', (req, res, next) => {
  const user = {name: req.body.name};

  return UserModel
    .insertOne(user)
    .then(() => res.send(user))
    .catch(err => next(err));
});

usersRouter.put('/', (req, res, next) => {
  const { id, update } = req.body;

  return UserModel
    .updateOne({_id: ObjectID(id)}, {$set: update})
    .then(response => res.send(response))
    .catch(err => next(err));
});

usersRouter.delete('/:userId', (req, res, next) => {
  const id = req.userId;

  return UserModel
    .deleteOne({_id: ObjectID(id)})
    .then(response => res.send(response, id))
    .catch(err => next(err));
});


usersRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});
