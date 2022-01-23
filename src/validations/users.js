import joi from 'joi';

const userSchema = joi.object({
    username: joi.string().min(3).max(30).required(),
    avatar: joi.string().pattern(new RegExp('https?:\/\/.*\.(?:png|jpg)'))
});

export {
    userSchema,
};
