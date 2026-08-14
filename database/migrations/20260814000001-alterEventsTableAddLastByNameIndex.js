module.exports = {
  async up(queryInterface, Sequelize) {
    // serves the "last event with the same name in an organization" lookup:
    // equality on ("organizationId", lower(trim(name))) then id DESC for LIMIT 1
    return queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "eventsOrganizationIdLowerNameIdIdx"
        ON "events" ("organizationId", LOWER(TRIM("name")), "id" DESC)
        WHERE "deletedAt" IS NULL;
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "eventsOrganizationIdLowerNameIdIdx";
    `)
  }
}
