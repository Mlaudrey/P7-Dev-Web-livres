const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = { userId: userId };
        next(); //appeler next pour passer au middleware suivant
    } catch(error) {
        res.status(401).json({ message: 'Requête non authentifiée !' });
    }
};
