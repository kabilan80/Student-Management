const path = require('path');
const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'sqlite';

const sequelize =
  dialect === 'sqlite'
    ? new Sequelize({
        dialect,
        storage: process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite'),
        logging: false,
      })
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        dialect,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT,
        logging: false,
      });

module.exports = sequelize;