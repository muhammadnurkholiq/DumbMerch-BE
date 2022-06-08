"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("users", [
      {
        name: "admin",
        email: "admin@admin.com",
        password:
          "$2b$10$aqojTWpfGODFH3Q2M5i2MuOC3ez8FLwj4Aw4FMoRA89oTwFP9NMkG",
        status: "admin",
      },
    ]);

    await queryInterface.bulkInsert("profiles", [
      {
        idUser: 1,
        image: "http://localhost:5000/uploads/profile/dumbmerch.png",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
