module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "positions" (
        "id"              BIGSERIAL PRIMARY KEY,
        "name"            varchar,
        "type"            varchar,
        "organizationId"  bigint,
        "ancestorOrgId"   bigint,
        "createdAt"       bigint,
        "updatedAt"       bigint,
        "deletedAt"       bigint
      );
      ALTER TABLE "positions" ADD CONSTRAINT "organizationIdFkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id");
      ALTER TABLE "positions" ADD CONSTRAINT "ancestorOrgIdFkey" FOREIGN KEY ("ancestorOrgId") REFERENCES "organizations" ("id");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "positions";
      ALTER TABLE "positionsOrganizations" DROP CONSTRAINT "organizationIdFkey";
      ALTER TABLE "positionsOrganizations" DROP CONSTRAINT "ancestorOrgIdFkey";
    `)
  }
}
