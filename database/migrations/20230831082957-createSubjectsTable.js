
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "subjects" (
        "id"        SERIAL PRIMARY KEY,
        "name"      varchar,
        "grade"     int,
        "createdAt" bigint,
        "deletedAt" bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "subjects"
    `)
  }
}
