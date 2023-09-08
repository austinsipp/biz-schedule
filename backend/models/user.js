'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

  };
  User.init({
    user_id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true

    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    roles: DataTypes.STRING,
    username: DataTypes.STRING,
    password_digest: DataTypes.STRING
  }, {
    sequelize,
    /*underscored: true,*/
    timestamps: false,
    modelName: 'User',
  });
  return User;
};