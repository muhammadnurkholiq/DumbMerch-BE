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

    // product
    await queryInterface.bulkInsert("products", [
      {
        image: "DumbMerch/Product/1656200384779-keyboard.png",
        name: "Keyboard",
        qty: 600,
        price: 299900,
        desc: "- Wireless Mouse - Konektivitas wireless 2.4 GHz - Jarak wireless hingga 10 m - Plug and Play - Baterai tahan hingga 12 bulan Mouse Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.",
        idUser: 1,
      },
      {
        image: "DumbMerch/Product/1656200496804-mouse.png",
        name: "Mouse",
        qty: 480,
        price: 180000,
        desc: "- Wireless Mouse - Konektivitas wireless 2.4 GHz - Jarak wireless hingga 10 m - Plug and Play - Baterai tahan hingga 12 bulan Mouse Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.",
        idUser: 1,
      },
      {
        image: "DumbMerch/Product/1656200521950-Monitor.jpg",
        name: "Monitor",
        qty: 250,
        price: 2700000,
        desc: "- Wireless Mouse - Konektivitas wireless 2.4 GHz - Jarak wireless hingga 10 m - Plug and Play - Baterai tahan hingga 12 bulan Mouse Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.",
        idUser: 1,
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
