module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "presences" ADD COLUMN IF NOT EXISTS "groupId" BIGINT DEFAULT NULL;  
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "presences" DROP COLUMN IF EXISTS "groupId";
    `)
  }
}
