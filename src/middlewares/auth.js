import jwt from 'jsonwebtoken';

export const getAuthState = (req, res, next) =>
  req.session.loggedUserName ?
    next() :
    res.status(403).json({errors: {global: 'неавторизованый пользователь. В доступе отказано'}});

export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if(!bearerHeader)  return res.status(403).json({error: 'no authorization header'});

  const token = bearerHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, tokenData) => {
    if(err) return next(err);

    req.tokenData = tokenData;
    next();
  });
};