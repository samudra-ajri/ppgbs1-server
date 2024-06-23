module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "directories" (
        "id"          BIGSERIAL PRIMARY KEY,
        "name"        varchar NOT NULL,
        "url"         text NOT NULL,
        "description" text,
        "createdAt"   bigint,
        "updatedAt"   bigint
      );
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "directories";
    `)
  }
}
