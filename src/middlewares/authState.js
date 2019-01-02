export const authState = (req, res, next) =>
  req.session.loggedUserName ?
    next() :
    res.status(403).json({errors: {global: 'неавторизованый пользователь. В доступе отказано'}});