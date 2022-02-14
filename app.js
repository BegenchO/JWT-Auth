const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        msg: 'JWT API'
    })
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'nosecretshere', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                msg: 'Post Created!',
                authData
            })
        }
    })
});

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        id: 1,
        name: 'Ben',
        email: 'ben@mail.com'
    }

    jwt.sign({user}, 'nosecretshere', {expiresIn: '30s'}, (err, token) => {
        res.json({
            token
        })
    });
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403)
    }
}

app.listen(5000, () => console.log('Server started on port 5000'));