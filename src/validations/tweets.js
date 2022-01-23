import joi from 'joi';

const tweetSchema = joi.object({
    username: joi.string().min(3).max(30).required(),
    tweet: joi.string().min(3).max(180).required(),
});

export {
    tweetSchema,
};
