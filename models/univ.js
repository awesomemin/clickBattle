const Sequelize = require('sequelize');

module.exports = class Univ extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      point: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Univ',
      tableName: 'univs',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    db.Univ.hasMany(db.User, { foreignKey: 'univ', sourceKey: 'name' });
  }
};