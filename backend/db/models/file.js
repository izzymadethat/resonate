"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      File.belongsTo(models.Project, { foreignKey: "projectId" });
      File.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  File.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      url: DataTypes.STRING,
      type: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "File"
    }
  );
  return File;
};
