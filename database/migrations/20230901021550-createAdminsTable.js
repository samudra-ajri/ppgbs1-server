module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "admins" (
        "userId"    bigint,
        "createdAt" bigint,
        "createdBy" bigint,
        "updatedAt" bigint,
        "updatedBy" bigint,
        "deletedAt" bigint,
        "deletedBy" bigint
      );
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "admins";
    `)
  }
}
