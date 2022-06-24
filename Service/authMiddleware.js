var jwt = require('jsonwebtoken');
require('dotenv').config();
exports.AuthenAPI = function (req, res, next) {
    const accessTokenSecret = process.env.API_SECERT_KEY;
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                 res.status(403);
                 return res.send({"Message":"Invalid Token"})
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }

}