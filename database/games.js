const Sequelize = require('sequelize');
const connection = require('./database');

const Games = connection.define("games", {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    ano:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    preco:{
        type:Sequelize.FLOAT,
        defaultValue:0.00
    }
});

Games.sync({force: false});

module.exports = Games;