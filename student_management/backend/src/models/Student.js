const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const required = (label) => ({ notEmpty: { msg: `${label} is required` } });

module.exports = sequelize.define('Student', {
  name: { type: DataTypes.STRING, allowNull: false, validate: required('Student name') },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: { msg: 'Enter a valid email address' } },
  },
  phone: { type: DataTypes.STRING, allowNull: false, validate: required('Phone number') },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Age must be a whole number' },
      min: { args: [1], msg: 'Age must be at least 1' },
      max: { args: [120], msg: 'Age must be 120 or less' },
    },
  },
});