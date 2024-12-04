"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, { foreignKey: "ownerId" });
      Project.hasMany(models.Client, { foreignKey: "projectId" });
      Project.hasMany(models.File, { foreignKey: "projectId" });
    }
  }
  Project.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 50]
        }
      },
      description: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Project"
    }
  );
  return Project;
};
