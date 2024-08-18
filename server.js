const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

const corsInfo = require('./middleware/cors')
const limiter = require('./middleware/ratelimt')

const Conversations = require('./DB/models/conversation')

dotenv.config();

// database
const mongodb = require('./DB/mongo-db');
mongodb.connect();

// middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(corsInfo)
app.use(limiter)


const API_KEYS = ["api_key1"]

// Middleware to authenticate requests
async function authenticate(req, res, next) {
    const apiKey = req.query.api_key;
    if (!apiKey) {
        console.log('no key')
        return res.status(401).send('Unauthorized');
    }

    try {
        const keyExists = await API_KEYS.includes(apiKey)
        if (!keyExists) {
            console.log('Unauthorized')
            return res.status(401).send('Unauthorized');
        }
        // console.log('Authorized')
        next();
    } catch (error) {
        console.error('Error checking API key:', error);
        res.status(500).send('Internal Server Error');
    }
}

app.get('/widget', authenticate, (req, res) => {
    console.log("get widget js file")
    const widgetFilePath = path.join(__dirname, 'widget.js');
    fs.readFile(widgetFilePath, (err, data) => {
        if (err) {
            console.error('Error reading widget.js file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.setHeader('Content-Type', 'application/javascript');
        res.send(data);
    });
});

app.get('/widget.css', authenticate, (req, res) => {
    console.log("get widget css file")
    const widgetCssPath = path.join(__dirname, 'widget.css');
    fs.readFile(widgetCssPath, (err, data) => {
        if (err) {
            console.error('Error reading widget.css file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.setHeader('Content-Type', 'text/css');
        res.send(data);
    });
});

app.get('/new-chat', async (req, res) => {
    console.log('new convo');
    const convo = new Conversations();
    await convo.save();
    res.status(200).json({ "response": convo.id })
});

const PORT = 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});