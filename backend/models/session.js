'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {

  };
  Session.init({
    session_id: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    expire_date: DataTypes.DATE,
    active_session: DataTypes.STRING
  }, {
    sequelize,
    /*underscored: true,*/
    timestamps: false,
    modelName: 'Session',
  });
  return Session;
};