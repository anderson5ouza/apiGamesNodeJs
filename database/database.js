const Sequelize = require('sequelize');

const connection = new Sequelize('api_games', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;