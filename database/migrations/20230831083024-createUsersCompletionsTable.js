
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "usersCompletions" (
        "userId"      bigint,
        "materialId"  int,
        "createdAt"   bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "usersCompletions"
    `)
  }
}
