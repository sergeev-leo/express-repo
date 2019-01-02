import express from 'express';
import {User} from "../models/User";
import bcrypt from "bcrypt";

export const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {

  const { userName, password } = req.body;

  User
    .findOne({name: userName})
    .then(user => {
      if(!user) return res.status(403).json({errors: {global: 'введены неверные данные'}});

      bcrypt.compare(password, user.hashedPassword)
        .then(result => {
          if(!result) return res.status(403).json({errors: {global: 'введены неверные данные'}});

          req.session.userId = user.id;
          res.send({loggedUserName: user.name});
        });
    })
    .catch(err => next(err));
});

authRouter.post('/register', (req, res, next) => {

  const { userName, password, age } = req.body;

  //TODO добавить валидацию полей при создании нового пользователя

  bcrypt.hash(password, 15)
    .then(hash => {
      const user = new User({name: userName, hashedPassword: hash, age});
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