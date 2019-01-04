import express from 'express';
import {User} from "../models/User";
import bcrypt from "bcrypt";
import {
  isInt,
  isEmail,
  isEmpty,
  isLength
} from 'validator';
import _mapValues from 'lodash/mapValues';

export const authRouter = express.Router();

const validators = {
  userName: userName => isEmpty(userName) || isInt(userName) || !isLength(userName, {min: 3, max: 15}),
  password: password => isEmpty(password) || !isLength(password, {min: 4, max: 15}),
  age: age => isEmpty(age) || !isInt(age) || (age < 18 || age > 110),
  email: email => isEmpty(email) || !isEmail(email)
};

authRouter.use((req, res, next) => {

  const errors = _mapValues(req.body, (value, key) => validators[key](value));

  Object.values(errors).forEach(field => {
    if(field) res.status(400).json({errors: {global: 'неверный формат данных'}});
  });

  next();
});

authRouter.post('/delete', (req, res, next) => {
  const { loggedUserName: userName } = req.session;
  const deletedUserId = User.findOne({userName}).id;
  User
    .deleteOne({userName})
    .then(() => {
      req.session.destroy();
      res.status(204).send({userName, id: deletedUserId});
    })
    .catch(err => next(err));
});

authRouter.put('/edit', (req, res, next) => {
  const { loggedUserName: userName } = req.session;
  User.findOne({userName})
    .then(user => {
      User
        .updateOne({_id: user.id}, {$set: req.body})
        .then(response => res.status(201).send(response))
        .catch(err => next(err));
    });
});

authRouter.post('/login', (req, res, next) => {

  const { userName, password } = req.body;

  User
    .findOne({userName})
    .then(user => {
      if(!user) return res.status(403).json({errors: {global: 'пользователь с таким именем не найден'}});

      bcrypt.compare(password, user.hashedPassword)
        .then(result => {
          if(!result) return res.status(403).json({errors: {global: 'введён неверный пароль'}});
          // записываем в сессию информацию по вошедшему пользователю
          req.session.loggedUserName = user.userName;
          // высылаем инфу по вошедшему пользователю и токен
          res.send({loggedUser: user.toAuthJSON()});
        });
    })
    .catch(err => next(err));
});

authRouter.post('/register', (req, res, next) => {

  const { userName, password, age, email } = req.body;

  bcrypt.hash(password, 15)
    .then(hash => {
      const user = new User({userName, hashedPassword: hash, age, email});
      user.save()
        .then(user => {
          res.status(200).send(user.id);
        })
        .catch(err => next(err))
    });
});

authRouter.post('/logout', (req, res, next) => {
  req.session.destroy();
  //TODO добавить редирект, когда будет куда редиректить)
  res.send({info: 'здесь будет редирект'});
});