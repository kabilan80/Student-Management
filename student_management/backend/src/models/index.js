const sequelize = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Course = require('./Course');
const Enrollment = require('./Enrollment');

Student.hasMany(Enrollment, { foreignKey: { name: 'StudentId', allowNull: false }, onDelete: 'CASCADE' });
Enrollment.belongsTo(Student, { foreignKey: { name: 'StudentId', allowNull: false } });
Course.hasMany(Enrollment, { foreignKey: { name: 'CourseId', allowNull: false }, onDelete: 'CASCADE' });
Enrollment.belongsTo(Course, { foreignKey: { name: 'CourseId', allowNull: false } });

module.exports = { sequelize, User, Student, Course, Enrollment };