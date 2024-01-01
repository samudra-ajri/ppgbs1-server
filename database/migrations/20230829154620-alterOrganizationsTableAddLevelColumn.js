module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS level int;
      CREATE INDEX IF NOT EXISTS organizationsLevelIdx ON "organizations" (level);
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS level;
      DROP INDEX IF EXISTS organizationsLevelIdx;
    `)
  }
}
