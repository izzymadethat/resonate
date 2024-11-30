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
					username: "reso-nator",
					hashedPassword: bcrypt.hashSync("password"),
				},
				{
					username: "FakeUser1",
					hashedPassword: bcrypt.hashSync("password2"),
				},
				{
					username: "FakeUser2",
					hashedPassword: bcrypt.hashSync("password3"),
				},
			],
			{ validate: true },
		);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Users";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				username: { [Op.in]: ["reso-nator", "FakeUser1", "FakeUser2"] },
			},
			{},
		);
	},
};
