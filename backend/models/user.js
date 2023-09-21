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
    /*underscored: true,*//*removed this because I don't like it. 
    It takes camelcase values (js convention) here in js and changes 
    them in the database to underscored, which is the sql convention. 
    I'd rather have it just literally match the database and not have to 
    do a conversion and risk not matching*/
    timestamps: false,
    modelName: 'User',
  });
  return User;
};