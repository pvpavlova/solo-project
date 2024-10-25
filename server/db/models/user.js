"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Income, Expense, Meter, Payment, Note }) {
      this.hasMany(Income, { foreignKey: "user_id" });
      this.hasMany(Expense, { foreignKey: "user_id" });
      this.hasMany(Meter, { foreignKey: "user_id" });
      this.hasMany(Payment, { foreignKey: "user_id" });
      this.hasMany(Note, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      user_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
