import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { userSchema } from './validations/users.js';
import { tweetSchema } from './validations/tweets.js';

const app = express();

app.use(cors());
app.use(express.json());

const database = fs.readFileSync('./src/database.json');

const users = JSON.parse(database.toString()).users;
const tweets = JSON.parse(database.toString()).tweets;

function saveData() {
    const db = {
        users,
        tweets,
    }

    fs.writeFileSync('./src/database.json', JSON.stringify(db))
}

app.post('/sign-up', (req, res) => {
    const {
        username,
        avatar,
    } = req.body;

    const validate = userSchema.validate({
        username,
        avatar,
    });
    
    if (validate.error) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    const searchUser = users.find((user) => username === user.username);

    if (searchUser) {
        return res.sendStatus(409);
    }

    users.push({
        username,
        avatar,
    });
    
    saveData();

    return res.status(201).send('OK');
});

app.post('/tweets', (req, res) => {
    const tweet = req.body;

    const validate = tweetSchema.validate(tweet);

    if (validate.error) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    const searchUser = users.find((user) => tweet.username === user.username);

    if (!searchUser) {
        return res.sendStatus(401);
    }

    tweets.push(tweet);

    saveData();

    return res.status(201).send('OK')
});

app.get('/tweets', (req, res) => {
    let lastTweets = [];
    const result = [];

    if (tweets.length >= 10) {
        for(let i = tweets.length - 10; i <= tweets.length - 1; i++) {
            lastTweets.push(tweets[i]);
        }
    }

    if (tweets.length < 10) {
        lastTweets = tweets;
    }

    lastTweets.map((tweet) => {
        const user = users.find((user) => user.username === tweet.username);

        result.push({
            ...user,
            tweet: tweet.tweet,
        })
    })
    
    return res.send(result);
})

app.get('/tweets/:username', (req, res) => {
    const { username } = req.params;

    const userInfo = users.find((user => user.username === username))

    if (!userInfo) {
        return res.sendStatus(400);
    }

    const usersTweet = tweets.filter((tweet) => username === tweet.username);

    const result = usersTweet.map((tweet) => {
        return {
            ...userInfo,
            tweet: tweet.tweet,
        }
    })
    
    return res.send(result);
})

export {
    app,
};
