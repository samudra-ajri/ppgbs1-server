module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "events" ADD COLUMN "grades" INTEGER[];  
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "events" DROP COLUMN IF EXISTS "grades";
    `)
  }
}
