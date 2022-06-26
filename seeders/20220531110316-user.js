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
        image: "DumbMerch/Profile/dumbmerch_rz6jgv.png",
        status: "admin",
      },
      {
        name: "user1",
        email: "user1@gmail.com",
        password:
          "$2b$10$aqojTWpfGODFH3Q2M5i2MuOC3ez8FLwj4Aw4FMoRA89oTwFP9NMkG",
        status: "customer",
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
