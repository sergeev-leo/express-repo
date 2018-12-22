import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import { usersRouter } from './mongo/routers/users';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use((req, res, next) => {
  // разрешены кроссдоменные запросы с этих url
  res.append('Access-Control-Allow-Origin', ['http://localhost:8081']);
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

app.use('/users', usersRouter);

app.use('/api/auth', (req, res) => {
  res.status(400).json({errors: {global: 'invalid credentials'}});
});




// порт
const PORT = process.env.PORT || 8080;
// URL подключения (стандартный для монгоДБ)
const url = 'mongodb://localhost:27017';
const databaseName = 'users';

/*
*  Для подключения выполнить в командной строке указав правильный путь к базе данных
*  "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\Users\User\Desktop\db"
*  */

mongoose.connect(`${url}/${databaseName}`, {useNewUrlParser: true})
  .then(() => {
    console.log('Mongoose is here');
    app.listen(PORT, () => console.log(`Подлюкчено, порт: ${PORT}`));
  })
  .catch(err => console.log('An error occured:', err));



