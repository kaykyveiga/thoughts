const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const User = require('./User')

const Thoughts = db.define('Thoughts' , {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
})

Thoughts.belongsTo(User)
User.hasMany(Thoughts)

module.exports = Thoughts