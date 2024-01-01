module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "events" (
        "id"              BIGSERIAL PRIMARY KEY,
        "organizationId"  bigint,
        "name"            varchar,
        "roomId"          varchar,
        "passcode"        varchar,
        "startDate"       bigint,
        "endDate"         bigint,
        "location"        varchar,
        "description"     text,
        "createdAt"       bigint,
        "createdBy"       bigint,
        "updatedAt"       bigint,
        "updatedBy"       bigint,
        "deletedAt"       bigint,
        "deletedBy"       bigint
      );
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "events";
    `)
  }
}
