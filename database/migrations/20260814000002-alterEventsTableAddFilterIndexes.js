module.exports = {
  async up(queryInterface, Sequelize) {
    // list filtered by organization, ordered by "startDate" DESC
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "eventsOrganizationIdStartDateIdx"
        ON "events" ("organizationId", "startDate" DESC)
        WHERE "deletedAt" IS NULL;
    `)

    // list filtered by room id
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "eventsRoomIdIdx"
        ON "events" ("roomId")
        WHERE "deletedAt" IS NULL;
    `)

    // grouped events lookup, only a handful of events belong to a group.
    // not partial on "deletedAt" because presenceRepository looks up group
    // members without that filter
    return queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "eventsGroupIdIdx"
        ON "events" ("groupId")
        WHERE "groupId" IS NOT NULL;
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "eventsOrganizationIdStartDateIdx";
    `)
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "eventsRoomIdIdx";
    `)
    return queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "eventsGroupIdIdx";
    `)
  }
}
