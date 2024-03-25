const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thoughts', 'root', 'HN5B7B0A', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3006'
})

try {
    sequelize.authenticate()
    console.log('Banco de dados conectado com sucesso!')
} catch (error) {
    console.log(`Não foi possível conectar ao banco de dados! ${error}`)
}

module.exports = sequelize