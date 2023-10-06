const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { UnAuthorizedError } = require('../utils/constants/unAuthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле должно быть заполнено.'],
    validate: [validator.isEmail, 'Некорректный email.'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Поле должно быть заполнено.'],
  },
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено.'],
    minlength: [2, 'минимальная длина поля — 2 символа.'],
    maxlength: [30, 'максимальная длина поля — 30 символов.'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnAuthorizedError('Неправильные пароль или почта.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnAuthorizedError('Неправильные пароль или почта.');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
