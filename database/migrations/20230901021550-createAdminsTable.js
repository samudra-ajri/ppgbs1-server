module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "admins" (
        "userId"    bigint UNIQUE,
        "createdAt" bigint,
        "createdBy" bigint,
        "updatedAt" bigint,
        "updatedBy" bigint
      );
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "admins";
    `)
  }
}
