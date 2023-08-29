module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "organization_hierarchies" (
        "ancestor_id" bigint,
        "descendant_id" bigint,
        "depth" int,
        "updated_at" bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "organization_hierarchies";
    `)
  }
}
