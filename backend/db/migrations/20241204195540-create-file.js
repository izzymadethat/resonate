"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Files",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Users",
            key: "id"
          },
          onDelete: "CASCADE"
        },
        projectId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Projects",
            key: "id"
          },
          onDelete: "CASCADE"
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        size: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        url: {
          type: Sequelize.STRING
        },
        type: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Files");
  }
};
