import { ObjectID } from 'mongodb';
import express from 'express';
import { UserModel } from '../models/User';

export const usersRouter = express.Router();


usersRouter.param('userId', (req, res, next, userId) => {
  //проверяем userId и либо присоединяем его к объекту запроса, либо выкидываем ошибку
  if(userId) {
    req.userId = userId;
    return next();
  }
  next(new Error('incorrect userId format'));
});

usersRouter.get('/', (req, res, next) => {
  UserModel
    .find({})
    .then(response => res.send(response))
    .catch(err => next(err));
});

usersRouter.get('/:userId', (req, res, next) => {
  const id = req.userId;
  const query = {
    _id: ObjectID(id)
  };
  UserModel
    .find(query)
    .then(response => res.send(response))
    .catch(err => next(err));
});

usersRouter.post('/', (req, res, next) => {
  const user = new UserModel({
    name: req.body.name,
    age: req.body.age
  });
  user.save()
      .then(newUser => res.send(newUser))
      .catch(err => next(err));

});

usersRouter.put('/:userId', (req, res, next) => {
  const id = req.userId;
  const update = req.body.update;
  UserModel
    .updateOne({_id: ObjectID(id)}, {$set: update})
    .then(response => res.status(201).send(response))
    .catch(err => next(err));
});

usersRouter.delete('/:userId', (req, res, next) => {
  const id = req.userId;

  UserModel
    .deleteOne({_id: ObjectID(id)})
    .then(response => res.status(204).send(response, id))
    .catch(err => next(err));
});


usersRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});
