"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Incomes",
      [
        {
          category: "Премия",
          value: 36000,
          user_id: 1,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Зарплата",
          value: 76000,
          user_id: 1,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          category: "Кэшбек",
          value: 360,
          user_id: 1,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Incomes", null, {});
  },
};
