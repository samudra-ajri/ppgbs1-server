module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "isGroupHead" BOOL DEFAULT FALSE;  
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "events" DROP COLUMN IF EXISTS "isGroupHead";
    `)
  }
}
