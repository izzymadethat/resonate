"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Files",
      "s3Key",
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Files";
    await queryInterface.removeColumn("Files", "s3Key", options);
  }
};
