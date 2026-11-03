const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define(
  'Enrollment',
  {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM('Active', 'Pending', 'Completed'),
      allowNull: false,
      defaultValue: 'Active',
    },
  },
  {
    indexes: [{ unique: true, fields: ['StudentId', 'CourseId'] }],
  }
);