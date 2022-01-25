const Sequelize = require('sequelize');
const User = require('./user');
const Univ = require('./univ');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Univ = Univ;

User.init(sequelize);
Univ.init(sequelize);

User.associate(db);
Univ.associate(db);

module.exports = db;