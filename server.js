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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/message', async (req, res) => {
    const message = req.body.message
    const conversationId = req.headers['x-conversation-id'];

    console.log('message', message);
    console.log('conversation', conversationId);

    await sleep(5000)
    res.status(200).json({ "response": "hello" });

});

app.get('/user-icon', (req, res) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101 101" id="user"><path d="M50.4 54.5c10.1 0 18.2-8.2 18.2-18.2S60.5 18 50.4 18s-18.2 8.2-18.2 18.2 8.1 18.3 18.2 18.3zm0-31.7c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4S37 43.7 37 36.3s6-13.5 13.4-13.5zM18.8 83h63.4c1.3 0 2.4-1.1 2.4-2.4 0-12.6-10.3-22.9-22.9-22.9H39.3c-12.6 0-22.9 10.3-22.9 22.9 0 1.3 1.1 2.4 2.4 2.4zm20.5-20.5h22.4c9.2 0 16.7 6.8 17.9 15.7H21.4c1.2-8.9 8.7-15.7 17.9-15.7z"></path></svg>`
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

app.get('/ai-icon', (req, res) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="ai"><circle cx="30" cy="30" r="1"></circle><path d="M58,29a1,1,0,0,0,1-1V21.86a4,4,0,1,0-2,0V27H40V24H37V7h5.14a4,4,0,1,0,0-2H36a1,1,0,0,0-1,1V24H33V14H31V24H29V6a1,1,0,0,0-1-1H21.86a4,4,0,1,0,0,2H27V24H24v3H7V21.86a4,4,0,1,0-2,0V28a1,1,0,0,0,1,1H24v2H14v2H24v2H6a1,1,0,0,0-1,1v6.14a4,4,0,1,0,2,0V37H24v3h3V57H21.86a4,4,0,1,0,0,2H28a1,1,0,0,0,1-1V40h2V50h2V40h2V58a1,1,0,0,0,1,1h6.14a4,4,0,1,0,0-2H37V40h3V37H57v5.14a4,4,0,1,0,2,0V36a1,1,0,0,0-1-1H40V33H50V31H40V29ZM33,37H27V35h6Zm-3-4a3,3,0,1,1,3-3A3,3,0,0,1,30,33Zm7,0H35V27h2Z"></path></svg>`
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

const PORT = 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});