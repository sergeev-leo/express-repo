export const authState = (req, res, next) =>
  req.session.userId ?
    next() :
    res.status(403).json({errors: {global: 'неавторизованый пользователь. В доступе отказано'}});