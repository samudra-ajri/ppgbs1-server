module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "users_positions" (
        "user_id" bigint,
        "position_id" bigint,
        "is_main" boolean,
        "created_at" bigint,
        "deleted_at" bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "users_positions";
    `)
  }
}
