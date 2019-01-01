export const authState = (req, res, next) =>
    req.session.userId ?
        next() :
        next(new Error("authentication Error"));