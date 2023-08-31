
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "materials" (
        "id"        SERIAL PRIMARY KEY,
        "subjectId" int,
        "name"      varchar,
        "parentId"  int,
        "createdAt" bigint,
        "deletedAt" bigint
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "materials"
    `)
  }
}
