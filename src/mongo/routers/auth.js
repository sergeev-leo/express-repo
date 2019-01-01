import express from 'express';
import {UserModel} from "../models/User";

export const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {

    const { userName, password } = req.body;

    UserModel
        .findOne({name: userName})
        .then(user => {
            if(!user || !user.verifyPassword(password))
                return res.status(403).json({errors: {global: 'invalid credentials'}});
            req.session.userId = user._id;
            res.send({});
        })
        .catch(err => next(err));
});

authRouter.post('/register', (req, res, next) => {

    const { userName, password, age } = req.body;

    //TODO добавить валидацию полей при создании нового пользователя

    const user = new UserModel({name: userName, password, age});

    user.save()
        .then(userId => res.status(200).send(userId))
        .catch(err => next(err));
});

authRouter.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.send({info: 'здесь будет редирект'});
});