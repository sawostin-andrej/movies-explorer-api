const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserId, updateUser,
} = require('../controllers/users');

router.get('/me', getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
