const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Course', {
  name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Course name is required' } } },
  duration: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Duration is required' } } },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: { args: [0], msg: 'Fee cannot be negative' } },
    get() {
      return Number(this.getDataValue('fee'));
    },
  },
});