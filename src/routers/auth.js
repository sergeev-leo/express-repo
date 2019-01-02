import express from 'express';
import {User} from "../models/User";
import bcrypt from "bcrypt";

export const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {

  const { userName, password } = req.body;

  User
    .findOne({userName})
    .then(user => {
      if(!user) return res.status(403).json({errors: {global: 'введены неверные данные'}});

      bcrypt.compare(password, user.hashedPassword)
        .then(result => {
          if(!result) return res.status(403).json({errors: {global: 'введены неверные данные'}});
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

  //TODO добавить валидацию полей при создании нового пользователя

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