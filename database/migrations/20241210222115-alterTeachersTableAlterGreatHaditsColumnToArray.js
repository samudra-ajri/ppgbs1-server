module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers" ALTER COLUMN "greatHadiths" TYPE VARCHAR[];
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers" ALTER COLUMN "greatHadiths" TYPE TEXT; 
    `)
  }
}
