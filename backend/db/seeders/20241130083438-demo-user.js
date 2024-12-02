"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          email: "reso-nator@demo.com",
          username: "reso-nator",
          firstName: "Reso",
          lastName: "Nator",
          hashedPassword: bcrypt.hashSync("password")
        },
        {
          email: "FakeUser1@demo.com",
          username: "FakeUser1",
          firstName: "Fake",
          lastName: "User",
          hashedPassword: bcrypt.hashSync("password2")
        },
        {
          email: "FakeUser2@demo.com",
          username: "FakeUser2",
          firstName: "Faker",
          lastName: "User",
          hashedPassword: bcrypt.hashSync("password3")
        }
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["reso-nator", "FakeUser1", "FakeUser2"] }
      },
      {}
    );
  }
};
