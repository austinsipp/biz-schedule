'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {

  };
  Schedule.init({
    shift_id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
      },
    user_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    start_shift: DataTypes.DATE,
    end_shift: DataTypes.DATE,
    location: DataTypes.STRING
  }, {
    sequelize,
    /*underscored: true,*/
    timestamps: false,
    modelName: 'Schedule',
    freezeTableName: true
  });
  return Schedule;
};