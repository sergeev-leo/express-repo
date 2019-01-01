import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import { config } from './config';
import { usersRouter } from './mongo/routers/users';
import { authRouter } from "./mongo/routers/auth";

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));


app.use(session({
    secret: config.SESSION_SECRET_PHRASE,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));


// надо удалить потом
app.use((req, res, next) => {
    req.session.visitsNumber += 1;
    next();
});
app.get('/', (req, res, next) => {
    res.send({visits: req.session.visitsNumber});
});



app.use((req, res, next) => {
  // разрешены кроссдоменные запросы с этих url
  res.append('Access-Control-Allow-Origin', [config.CLIENT_ORIGIN]);
  // перечислены разрешённые заголовки (для ответа на options)
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  //перечислены разрешённые методы (для ответа на options)
  res.append('Access-Control-Allow-Methods', ['POST', 'GET', 'PUT', 'DELETE']);
  // указываются имена заголовков, которые необходимо разрешить вручную
  res.append('Access-Control-Expose-Headers', '');
  // разрешение передачи cookies и http-авторизации
  res.append('Access-Control-Allow-Credentials', 'true');

  next();
});

 app.use('/users', cors(corsOptions), usersRouter);

app.use('/auth', authRouter);




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



