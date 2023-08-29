
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "organizations" (
        "id" BIGSERIAL PRIMARY KEY,
        "name" varchar,
        "created_at" bigint,
        "updated_at" bigint,
        "deleted_at" bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "organizations"
    `)
  }
};
