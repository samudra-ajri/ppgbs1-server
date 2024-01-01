module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "organizationHierarchies" (
        "ancestorId"    bigint,
        "descendantId"  bigint,
        "depth"         int,
        "updatedAt"     bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "organizationHierarchies";
    `)
  }
}
