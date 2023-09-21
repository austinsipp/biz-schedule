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
    /*underscored: true,*//*removed this because I don't like it. 
    It takes camelcase values (js convention) here in js and changes 
    them in the database to underscored, which is the sql convention. 
    I'd rather have it just literally match the database and not have to 
    do a conversion and risk not matching*/
    timestamps: false,
    modelName: 'Schedule',
    freezeTableName: true/*had to add this because it was converting "Schedule"
     and thinking that it would be called "Sechdules" in the database, which 
     was incorrect. Much rather have it match explicitly, rather than relying 
     on a correct conversion between sequelize and the database*/
  });
  return Schedule;
};