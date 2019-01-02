import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import { config } from './config';
import { usersRouter } from './routers/users';
import { authRouter } from "./routers/auth";
import {recipesRouter} from "./routers/recipes";
import {authState} from "./middlewares/authState";

// опции для cors-middleware
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

// создаём MongoStore для хранения сессии
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

// настройки для session-middleware, указываем где в монго хранить сессию
app.use(session({
  secret: config.SESSION_SECRET_PHRASE,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));



app.use('/auth', authRouter);
app.use('/users', cors(corsOptions), authState, usersRouter);
app.use('/recipes', cors(corsOptions), authState, recipesRouter);




// порт
const PORT = process.env.PORT || config.PORT;
// URL подключения (стандартный для монгоДБ)
const url = config.MONGODB_CONNECTION_URL;
const databaseName = config.DATABASE_NAME;

mongoose.connect(`${url}/${databaseName}`, {useNewUrlParser: true})
  .then(() => {
    console.log('mongodb: соединение установлено');
    app.listen(PORT, () => console.log(`express RESTApi: соединение установлено, порт: ${PORT}`));
  })
  .catch(err => console.log('mongodb: не удалось подключиться:', err));



