const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Name is required' } } },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'Enter a valid email address' } },
      set(value) {
        this.setDataValue('email', String(value).trim().toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: { args: [6, 100], msg: 'Password must be at least 6 characters' } },
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

User.prototype.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

User.prototype.toPublic = function () {
  return { id: this.id, name: this.name, email: this.email };
};

module.exports = User;