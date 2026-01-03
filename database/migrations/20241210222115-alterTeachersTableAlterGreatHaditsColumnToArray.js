module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers" ALTER COLUMN "greatHadiths" TYPE VARCHAR[] USING ARRAY["greatHadiths"];
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers" ALTER COLUMN "greatHadiths" TYPE TEXT USING ("greatHadiths")[1]; 
    `)
  }
}
