const Sequelize = require('sequelize')
const villainsModel = require('./villains')

const connection = new Sequelize('villains', 'villains', 'villain$', {
  host: 'localhost', dialect: 'mysql'
})

const villains = villainsModel(connection, Sequelize)

module.exports = { villains }
